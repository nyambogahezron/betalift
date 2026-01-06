import type { NextFunction, Request, Response } from "express";

type AsyncFunction<T extends Request = Request> = (
	req: T,
	res: Response,
	next: NextFunction,
) => Promise<unknown>;

const asyncHandler = <T extends Request = Request>(fn: AsyncFunction<T>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req as T, res, next)).catch(next);
	};
};

export default asyncHandler;
