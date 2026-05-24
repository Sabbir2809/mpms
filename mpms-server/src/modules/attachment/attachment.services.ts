import { Types } from "mongoose";
import { UserRole } from "../../types";
import { AppError } from "../../utils/appError";
import { deleteFile, getFileUrl } from "../../utils/upload";
import { Task } from "../task/task.model";
import { AttachmentType, IAttachment } from "./attachment.interface";
import { Attachment } from "./attachment.model";

const resolveAttachmentType = (mimetype: string): AttachmentType => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  return "other";
};

const uploadAttachments = async (
  projectId: string,
  taskId: string,
  files: Express.Multer.File[],
  userId: string,
): Promise<IAttachment[]> => {
  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    files.forEach((f) => deleteFile(getFileUrl(f.filename)));
    throw new AppError("Task not found", 404);
  }

  const attachments = await Attachment.insertMany(
    files.map((file) => ({
      task: new Types.ObjectId(taskId),
      project: new Types.ObjectId(projectId),
      uploadedBy: new Types.ObjectId(userId),
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: getFileUrl(file.filename),
      type: resolveAttachmentType(file.mimetype),
    })),
  );

  const attachmentIds = attachments.map((a) => a._id);
  await Task.findByIdAndUpdate(taskId, {
    $push: { attachments: { $each: attachmentIds } },
  });

  return attachments;
};

const getAttachmentsByTask = async (
  projectId: string,
  taskId: string,
): Promise<IAttachment[]> => {
  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) throw new AppError("Task not found", 404);

  return Attachment.find({ task: taskId, project: projectId })
    .populate("uploadedBy", "name email avatar")
    .sort({ createdAt: -1 });
};

const deleteAttachment = async (
  projectId: string,
  taskId: string,
  attachmentId: string,
  userId: string,
  userRole: UserRole,
): Promise<void> => {
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    task: taskId,
    project: projectId,
  });

  if (!attachment) throw new AppError("Attachment not found", 404);

  if (
    attachment.uploadedBy.toString() !== userId &&
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.MANAGER
  ) {
    throw new AppError("You can only delete your own attachments", 403);
  }

  deleteFile(attachment.url);

  await Promise.all([
    Attachment.findByIdAndDelete(attachmentId),
    Task.findByIdAndUpdate(taskId, {
      $pull: { attachments: new Types.ObjectId(attachmentId) },
    }),
  ]);
};

export const attachmentServices = {
  uploadAttachments,
  getAttachmentsByTask,
  deleteAttachment,
};
