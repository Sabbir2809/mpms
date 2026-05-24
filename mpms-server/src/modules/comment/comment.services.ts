import { Types } from "mongoose";
import { UserRole } from "../../types";
import { AppError } from "../../utils/appError";
import { Task } from "../task/task.model";
import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { CreateCommentInput, UpdateCommentInput } from "./comment.validations";

const getCommentsByTask = async (
  projectId: string,
  taskId: string,
): Promise<IComment[]> => {
  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) throw new AppError("Task not found", 404);

  const comments = await Comment.find({
    task: taskId,
    parentComment: null,
    isDeleted: false,
  })
    .populate("author", "name email avatar")
    .populate("mentions", "name email")
    .populate({
      path: "replies",
      match: { isDeleted: false },
      populate: [
        { path: "author", select: "name email avatar" },
        { path: "mentions", select: "name email" },
      ],
      options: { sort: { createdAt: 1 } },
    })
    .sort({ createdAt: 1 });

  return comments;
};

const createComment = async (
  projectId: string,
  taskId: string,
  input: CreateCommentInput,
  userId: string,
): Promise<IComment> => {
  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) throw new AppError("Task not found", 404);

  if (input.parentComment) {
    const parent = await Comment.findById(input.parentComment);
    if (!parent || parent.isDeleted) {
      throw new AppError("Parent comment not found", 404);
    }
  }

  const comment = await Comment.create({
    task: new Types.ObjectId(taskId),
    project: new Types.ObjectId(projectId),
    author: new Types.ObjectId(userId),
    content: input.content,
    parentComment: input.parentComment
      ? new Types.ObjectId(input.parentComment)
      : null,
    mentions: (input.mentions || []).map(
      (id: string) => new Types.ObjectId(id),
    ),
  });

  return comment.populate([
    { path: "author", select: "name email avatar" },
    { path: "mentions", select: "name email" },
  ]);
};

const updateComment = async (
  commentId: string,
  input: UpdateCommentInput,
  userId: string,
  userRole: UserRole,
): Promise<IComment> => {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.isDeleted) {
    throw new AppError("Comment not found", 404);
  }

  if (
    comment.author.toString() !== userId &&
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.MANAGER
  ) {
    throw new AppError("You can only edit your own comments", 403);
  }

  const updated = await Comment.findByIdAndUpdate(
    commentId,
    { content: input.content, isEdited: true, editedAt: new Date() },
    { new: true },
  ).populate("author", "name email avatar");

  if (!updated) throw new AppError("Comment not found", 404);
  return updated;
};

const deleteComment = async (
  commentId: string,
  userId: string,
  userRole: UserRole,
): Promise<void> => {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.isDeleted) {
    throw new AppError("Comment not found", 404);
  }

  if (
    comment.author.toString() !== userId &&
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.MANAGER
  ) {
    throw new AppError("You can only delete your own comments", 403);
  }

  await Comment.findByIdAndUpdate(commentId, {
    isDeleted: true,
    content: "[deleted]",
  });
};

export const commentServices = {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
};
