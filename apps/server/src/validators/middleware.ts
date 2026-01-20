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
			const validated = await schema.parseAsync(req.query)
			// Fix: Do not overwrite req.query object directly as it might be read-only
			// Instead, we can assign properties if needed, or rely on the validated data being close enough
			// In Express 5, req.query is a getter/setter, but some setups make it read-only.
			// However, since we are validating, we can just ensure type safety or replace content.
			// Safe approach: property copy
			Object.keys(req.query).forEach((key) => delete req.query[key])
			Object.assign(req.query, validated)
			next()
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
			const validated = await schema.parseAsync(req.params)
			// Fix: Same for params
			Object.keys(req.params).forEach((key) => delete req.params[key])
			Object.assign(req.params, validated)
			next()
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
