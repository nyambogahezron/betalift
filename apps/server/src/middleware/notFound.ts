import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../utils/errors";

export const notFound = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// Ignore browser/dev tool requests to reduce log noise
	if (req.originalUrl.startsWith("/.well-known/")) {
		res.status(404).end();
		return;
	}

	next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
