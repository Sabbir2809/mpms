import { Types } from "mongoose";
import { TaskPriority, TaskStatus } from "../../types";
import { AppError } from "../../utils/appError";
import { Project } from "../project/project.model";
import { Sprint } from "../sprint/sprint.model";
import { Task } from "../task/task.model";

// Project Progress Report
const getProjectProgressReport = async (projectId: string) => {
  const project = await Project.findById(projectId).populate(
    "members",
    "name email avatar",
  );
  if (!project) throw new AppError("Project not found", 404);

  const [sprints, tasks] = await Promise.all([
    Sprint.find({ project: projectId }),
    Task.find({ project: projectId }),
  ]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === TaskStatus.DONE,
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS,
  ).length;
  const reviewTasks = tasks.filter(
    (t) => t.status === TaskStatus.REVIEW,
  ).length;
  const todoTasks = tasks.filter((t) => t.status === TaskStatus.TODO).length;

  const totalEstimateHours = tasks.reduce(
    (sum, t) => sum + (t.estimateHours || 0),
    0,
  );
  const totalLoggedHours = tasks.reduce(
    (sum, t) => sum + (t.loggedHours || 0),
    0,
  );

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityBreakdown = {
    low: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
    medium: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
    high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
    urgent: tasks.filter((t) => t.priority === TaskPriority.URGENT).length,
  };

  const sprintProgress = await Promise.all(
    sprints.map(async (sprint) => {
      const sprintTasks = tasks.filter(
        (t) => t.sprint?.toString() === sprint._id.toString(),
      );
      const sprintDone = sprintTasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length;
      return {
        sprintId: sprint._id,
        sprintName: sprint.name,
        sprintNumber: sprint.sprintNumber,
        status: sprint.status,
        totalTasks: sprintTasks.length,
        completedTasks: sprintDone,
        completionPercentage:
          sprintTasks.length > 0
            ? Math.round((sprintDone / sprintTasks.length) * 100)
            : 0,
      };
    }),
  );

  const now = new Date();
  const totalDays =
    (new Date(project.endDate).getTime() -
      new Date(project.startDate).getTime()) /
    (1000 * 60 * 60 * 24);
  const elapsedDays =
    (now.getTime() - new Date(project.startDate).getTime()) /
    (1000 * 60 * 60 * 24);
  const timeProgress =
    totalDays > 0
      ? Math.min(100, Math.round((elapsedDays / totalDays) * 100))
      : 0;

  return {
    project: {
      id: project._id,
      title: project.title,
      client: project.client,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      memberCount: project.members.length,
    },
    taskSummary: {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      review: reviewTasks,
      completed: completedTasks,
      completionPercentage,
    },
    timeTracking: {
      totalEstimateHours,
      totalLoggedHours,
      remainingHours: Math.max(0, totalEstimateHours - totalLoggedHours),
    },
    timeline: {
      totalDays: Math.round(totalDays),
      elapsedDays: Math.round(elapsedDays),
      timeProgress,
    },
    priorityBreakdown,
    sprintProgress,
    generatedAt: new Date(),
  };
};

// User Progress Report
const getUserProgressReport = async (projectId: string, userId?: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const taskFilter: Record<string, unknown> = { project: projectId };
  if (userId) taskFilter.assignees = new Types.ObjectId(userId);

  const tasks = await Task.find(taskFilter)
    .populate("assignees", "name email avatar department")
    .lean();

  type UserStats = {
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    department: string;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    reviewTasks: number;
    todoTasks: number;
    totalLoggedHours: number;
    totalEstimateHours: number;
    completionRate: number;
    overdueTasks: number;
  };

  const userMap = new Map<string, UserStats>();
  const now = new Date();

  tasks.forEach((task) => {
    const assignees = task.assignees as unknown as Array<{
      _id: { toString(): string };
      name: string;
      email: string;
      avatar?: string;
      department: string;
    }>;

    assignees.forEach((assignee) => {
      const uid = assignee._id.toString();
      if (!userMap.has(uid)) {
        userMap.set(uid, {
          userId: uid,
          name: assignee.name,
          email: assignee.email,
          avatar: assignee.avatar,
          department: assignee.department || "",
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          reviewTasks: 0,
          todoTasks: 0,
          totalLoggedHours: 0,
          totalEstimateHours: 0,
          completionRate: 0,
          overdueTasks: 0,
        });
      }

      const stats = userMap.get(uid)!;
      stats.totalTasks += 1;
      stats.totalLoggedHours += task.loggedHours || 0;
      stats.totalEstimateHours += task.estimateHours || 0;

      if (task.status === TaskStatus.DONE) stats.completedTasks += 1;
      else if (task.status === TaskStatus.IN_PROGRESS)
        stats.inProgressTasks += 1;
      else if (task.status === TaskStatus.REVIEW) stats.reviewTasks += 1;
      else stats.todoTasks += 1;

      if (
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== TaskStatus.DONE
      ) {
        stats.overdueTasks += 1;
      }
    });
  });

  const userStats = Array.from(userMap.values()).map((stats) => ({
    ...stats,
    completionRate:
      stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0,
  }));

  return {
    projectId,
    projectTitle: project.title,
    userStats,
    generatedAt: new Date(),
  };
};

// Task Summary Report
const getTaskSummaryReport = async (projectId: string, sprintId?: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const filter: Record<string, unknown> = { project: projectId };
  if (sprintId) filter.sprint = new Types.ObjectId(sprintId);

  const tasks = await Task.find(filter)
    .populate("assignees", "name email avatar")
    .populate("sprint", "name sprintNumber")
    .lean();

  const now = new Date();
  const overdueTasks = tasks.filter(
    (t) =>
      t.dueDate && new Date(t.dueDate) < now && t.status !== TaskStatus.DONE,
  );

  const byStatus = {
    todo: tasks.filter((t) => t.status === TaskStatus.TODO),
    in_progress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
    review: tasks.filter((t) => t.status === TaskStatus.REVIEW),
    done: tasks.filter((t) => t.status === TaskStatus.DONE),
  };

  const byPriority = {
    low: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
    medium: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
    high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
    urgent: tasks.filter((t) => t.priority === TaskPriority.URGENT).length,
  };

  const completedWithinEstimate = tasks.filter(
    (t) =>
      t.status === TaskStatus.DONE &&
      t.estimateHours > 0 &&
      t.loggedHours <= t.estimateHours,
  ).length;

  return {
    projectId,
    projectTitle: project.title,
    sprintId: sprintId || null,
    summary: {
      total: tasks.length,
      byStatus: {
        todo: byStatus.todo.length,
        in_progress: byStatus.in_progress.length,
        review: byStatus.review.length,
        done: byStatus.done.length,
      },
      byPriority,
      overdue: overdueTasks.length,
      completedWithinEstimate,
    },
    overdueTasks: overdueTasks.map((t) => ({
      id: t._id,
      title: t.title,
      dueDate: t.dueDate,
      status: t.status,
      priority: t.priority,
      assignees: t.assignees,
    })),
    tasks: tasks.map((t) => ({
      id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      assignees: t.assignees,
      estimateHours: t.estimateHours,
      loggedHours: t.loggedHours,
      dueDate: t.dueDate,
      sprint: t.sprint,
      subtasksTotal: t.subtasks?.length || 0,
      subtasksDone:
        t.subtasks?.filter((s: { isCompleted: boolean }) => s.isCompleted)
          .length || 0,
    })),
    generatedAt: new Date(),
  };
};

// Time Log Summary Report
const getTimeLogReport = async (
  projectId: string,
  startDate?: string,
  endDate?: string,
) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const filter: Record<string, unknown> = { project: projectId };
  if (startDate || endDate) {
    filter.updatedAt = {} as Record<string, Date>;
    if (startDate)
      (filter.updatedAt as Record<string, Date>).$gte = new Date(startDate);
    if (endDate)
      (filter.updatedAt as Record<string, Date>).$lte = new Date(endDate);
  }

  const tasks = await Task.find(filter)
    .populate("assignees", "name email avatar")
    .populate("sprint", "name sprintNumber")
    .lean();

  const sprints = await Sprint.find({ project: projectId }).lean();

  const totalEstimate = tasks.reduce((s, t) => s + (t.estimateHours || 0), 0);
  const totalLogged = tasks.reduce((s, t) => s + (t.loggedHours || 0), 0);

  const byMember = new Map<
    string,
    {
      userId: string;
      name: string;
      email: string;
      loggedHours: number;
      taskCount: number;
    }
  >();

  tasks.forEach((task) => {
    const perAssignee =
      task.assignees.length > 0 ? task.loggedHours / task.assignees.length : 0;

    (
      task.assignees as unknown as Array<{
        _id: { toString(): string };
        name: string;
        email: string;
      }>
    ).forEach((a) => {
      const uid = a._id.toString();
      if (!byMember.has(uid)) {
        byMember.set(uid, {
          userId: uid,
          name: a.name,
          email: a.email,
          loggedHours: 0,
          taskCount: 0,
        });
      }
      const m = byMember.get(uid)!;
      m.loggedHours += perAssignee;
      m.taskCount += 1;
    });
  });

  const bySprint = sprints.map((sprint) => {
    const sprintTasks = tasks.filter(
      (t) => t.sprint?.toString() === sprint._id.toString(),
    );
    return {
      sprintId: sprint._id,
      sprintName: sprint.name,
      sprintNumber: sprint.sprintNumber,
      estimateHours: sprintTasks.reduce(
        (s, t) => s + (t.estimateHours || 0),
        0,
      ),
      loggedHours: sprintTasks.reduce((s, t) => s + (t.loggedHours || 0), 0),
      taskCount: sprintTasks.length,
    };
  });

  return {
    projectId,
    projectTitle: project.title,
    dateRange: { startDate: startDate || null, endDate: endDate || null },
    overall: {
      totalEstimateHours: totalEstimate,
      totalLoggedHours: Math.round(totalLogged * 100) / 100,
      variance: Math.round((totalLogged - totalEstimate) * 100) / 100,
      efficiency:
        totalLogged > 0 ? Math.round((totalEstimate / totalLogged) * 100) : 0,
    },
    byMember: Array.from(byMember.values()).map((m) => ({
      ...m,
      loggedHours: Math.round(m.loggedHours * 100) / 100,
    })),
    bySprint,
    generatedAt: new Date(),
  };
};

export const reportServices = {
  getUserProgressReport,
  getProjectProgressReport,
  getTaskSummaryReport,
  getTimeLogReport,
};
