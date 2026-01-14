import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import type { Request } from "express";
import ENV from "../config/env";
import { BadRequestError } from "../utils/errors";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", ENV.uploadDir);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new BadRequestError("Only images and documents are allowed"));
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: ENV.maxFileSize,
    },
    fileFilter: fileFilter,
});
