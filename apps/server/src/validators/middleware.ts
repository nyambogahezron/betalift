import type { NextFunction, Request, Response } from "express";
import { ZodError, type z } from "zod";
import { BadRequestError } from "../utils/errors/index.js";

export const validate = (schema: z.ZodTypeAny) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const firstError = error.issues[0];
				const message = firstError?.message || "Validation error";
				next(new BadRequestError(message));
			} else {
				next(error);
			}
		}
	};
};

export const validateBody = (schema: z.ZodTypeAny) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const validated = await schema.parseAsync(req.body);
			req.body = validated;
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const firstError = error.issues[0];
				const message = firstError?.message || "Validation error";
				next(new BadRequestError(message));
			} else {
				next(error);
			}
		}
	};
};

export const validateQuery = (schema: z.ZodTypeAny) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const validated = await schema.parseAsync(req.query);
			req.query = validated as unknown as Request["query"];
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const firstError = error.issues[0];
				const message = firstError?.message || "Validation error";
				next(new BadRequestError(message));
			} else {
				next(error);
			}
		}
	};
};

export const validateParams = (schema: z.ZodTypeAny) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const validated = await schema.parseAsync(req.params);
			req.params = validated as unknown as Request["params"];
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const firstError = error.issues[0];
				const message = firstError?.message || "Validation error";
				next(new BadRequestError(message));
			} else {
				next(error);
			}
		}
	};
};
