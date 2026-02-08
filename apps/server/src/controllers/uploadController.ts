import type { NextFunction, Request, Response } from "express";
import ENV from "../config/env";
import { BadRequestError } from "../utils/errors";

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.file) {
			return next(new BadRequestError("No file uploaded"));
		}

		const fileUrl = `${ENV.serverUrl}/public/${ENV.uploadDir}/${req.file.filename}`;

		res.status(200).json({
			success: true,
			message: "File uploaded successfully",
			data: {
				url: fileUrl,
				filename: req.file.filename,
				mimetype: req.file.mimetype,
				size: req.file.size,
			},
		});
	} catch (error) {
		next(error);
	}
};
