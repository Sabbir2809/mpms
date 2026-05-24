import { FilterQuery, Types } from "mongoose";
import { PaginationResult, TaskPriority, TaskStatus } from "../../types";
import { AppError } from "../../utils/appError";
import { Project } from "../project/project.model";
import { ITask } from "./task.interface";
import { Task } from "./task.model";
import {
  AddSubtaskInput,
  CreateTaskInput,
  LogHoursInput,
  TaskQueryInput,
  UpdateSubtaskInput,
  UpdateTaskInput,
} from "./task.validations";

interface TasksResult {
  tasks: ITask[];
  pagination: PaginationResult;
}

const populateTask = (
  query: ReturnType<typeof Task.findOne | typeof Task.findById>,
) =>
  query
    .populate("assignees", "name email avatar")
    .populate("createdBy", "name email avatar")
    .populate("reviewedBy", "name email avatar")
    .populate("attachments")
    .populate("sprint", "name sprintNumber");

const createTask = async (
  projectId: string,
  input: CreateTaskInput,
  userId: string,
): Promise<ITask> => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const lastTask = await Task.findOne({
    project: projectId,
    status: input.status || TaskStatus.TODO,
  })
    .sort({ order: -1 })
    .select("order");

  const order =
    input.order !== undefined ? input.order : (lastTask?.order || 0) + 1;

  const task = await Task.create({
    ...input,
    project: new Types.ObjectId(projectId),
    sprint: input.sprint ? new Types.ObjectId(input.sprint) : undefined,
    assignees: (input.assignees || []).map(
      (id: string) => new Types.ObjectId(id),
    ),
    priority: input.priority as TaskPriority,
    status: input.status as TaskStatus,
    dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    createdBy: new Types.ObjectId(userId),
    order,
  });

  return populateTask(Task.findById(task._id)) as Promise<ITask>;
};

const getTasks = async (
  projectId: string,
  query: TaskQueryInput,
): Promise<TasksResult> => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "20", 10);
  const skip = (page - 1) * limit;

  const filter: FilterQuery<ITask> = { project: projectId };

  if (query.search) filter.$text = { $search: query.search };
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.sprint) filter.sprint = new Types.ObjectId(query.sprint);
  if (query.assignee) filter.assignees = new Types.ObjectId(query.assignee);
  if (query.dueDate) filter.dueDate = { $lte: new Date(query.dueDate) };
  if (query.tags) filter.tags = { $in: query.tags.split(",") };

  const sortField = query.sort || "order";
  const sortOrder = query.order === "desc" ? -1 : 1;

  const [tasks, total] = await Promise.all([
    populateTask(
      Task.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit) as ReturnType<typeof Task.findOne>,
    ),
    Task.countDocuments(filter),
  ]);

  return {
    tasks: tasks as unknown as ITask[],
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const getKanbanTasks = async (
  projectId: string,
  sprintId?: string,
): Promise<Record<string, ITask[]>> => {
  const filter: FilterQuery<ITask> = { project: projectId };
  if (sprintId) filter.sprint = new Types.ObjectId(sprintId);

  const tasks = (await populateTask(
    Task.find(filter).sort({ order: 1 }) as ReturnType<typeof Task.findOne>,
  )) as unknown as ITask[];

  const board: Record<string, ITask[]> = {
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  tasks.forEach((task) => {
    board[task.status].push(task);
  });

  return board;
};

const getTaskById = async (
  projectId: string,
  taskId: string,
): Promise<ITask> => {
  const task = await populateTask(
    Task.findOne({ _id: taskId, project: projectId }) as ReturnType<
      typeof Task.findOne
    >,
  );

  if (!task) throw new AppError("Task not found", 404);
  return task as unknown as ITask;
};

const updateTask = async (
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<ITask> => {
  const updateData: Record<string, unknown> = { ...input };

  if (input.assignees) {
    updateData.assignees = input.assignees.map(
      (id: string) => new Types.ObjectId(id),
    );
  }
  if (input.sprint) {
    updateData.sprint = new Types.ObjectId(input.sprint);
  }
  if (input.sprint === null) {
    updateData.sprint = undefined;
  }
  if (input.dueDate) updateData.dueDate = new Date(input.dueDate);
  if (input.dueDate === null) updateData.dueDate = undefined;
  if (input.status) {
    updateData.status = input.status as TaskStatus;
    if (input.status === "done") updateData.completedAt = new Date();
    else updateData.completedAt = undefined;
  }
  if (input.priority) updateData.priority = input.priority as TaskPriority;

  const task = await populateTask(
    Task.findOneAndUpdate({ _id: taskId, project: projectId }, updateData, {
      new: true,
      runValidators: true,
    }) as ReturnType<typeof Task.findOne>,
  );

  if (!task) throw new AppError("Task not found", 404);
  return task as unknown as ITask;
};

const deleteTask = async (projectId: string, taskId: string): Promise<void> => {
  const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });
  if (!task) throw new AppError("Task not found", 404);
};

const addSubtask = async (
  projectId: string,
  taskId: string,
  input: AddSubtaskInput,
): Promise<ITask> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    { $push: { subtasks: { title: input.title, isCompleted: false } } },
    { new: true },
  );
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const updateSubtask = async (
  projectId: string,
  taskId: string,
  subtaskId: string,
  input: UpdateSubtaskInput,
  userId: string,
): Promise<ITask> => {
  const setFields: Record<string, unknown> = {};
  if (input.title !== undefined) setFields["subtasks.$.title"] = input.title;
  if (input.isCompleted !== undefined) {
    setFields["subtasks.$.isCompleted"] = input.isCompleted;
    if (input.isCompleted) {
      setFields["subtasks.$.completedAt"] = new Date();
      setFields["subtasks.$.completedBy"] = new Types.ObjectId(userId);
    } else {
      setFields["subtasks.$.completedAt"] = undefined;
      setFields["subtasks.$.completedBy"] = undefined;
    }
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId, "subtasks._id": subtaskId },
    { $set: setFields },
    { new: true },
  );
  if (!task) throw new AppError("Task or subtask not found", 404);
  return task;
};

const deleteSubtask = async (
  projectId: string,
  taskId: string,
  subtaskId: string,
): Promise<ITask> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    { $pull: { subtasks: { _id: new Types.ObjectId(subtaskId) } } },
    { new: true },
  );
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const logHours = async (
  projectId: string,
  taskId: string,
  input: LogHoursInput,
): Promise<ITask> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    { $inc: { loggedHours: input.hours } },
    { new: true },
  );
  if (!task) throw new AppError("Task not found", 404);
  return task;
};

const approveTask = async (
  projectId: string,
  taskId: string,
  userId: string,
): Promise<ITask> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId, status: "review" },
    {
      status: TaskStatus.DONE,
      reviewedBy: new Types.ObjectId(userId),
      reviewedAt: new Date(),
      completedAt: new Date(),
    },
    { new: true },
  );
  if (!task) throw new AppError("Task not found or not in review status", 404);
  return task;
};

const rejectTask = async (
  projectId: string,
  taskId: string,
  userId: string,
): Promise<ITask> => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId, status: "review" },
    {
      status: TaskStatus.IN_PROGRESS,
      reviewedBy: new Types.ObjectId(userId),
      reviewedAt: new Date(),
    },
    { new: true },
  );
  if (!task) throw new AppError("Task not found or not in review status", 404);
  return task;
};

export const taskServices = {
  createTask,
  getTasks,
  getKanbanTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  logHours,
  approveTask,
  rejectTask,
};
