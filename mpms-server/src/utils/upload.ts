import { Request } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { env } from "../config/env";
import { AppError } from "./appError";

const ensureUploadDir = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    const uploadPath = path.join(process.cwd(), env.uploadDir);
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed",
        400,
      ),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSize,
    files: 10,
  },
});

export const getFileUrl = (filename: string): string => {
  return `/uploads/${filename}`;
};

export const deleteFile = (filePath: string): void => {
  const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};
