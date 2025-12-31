import { validationResult } from 'express-validator'
import { Request } from 'express'
import { BadRequestError } from '../utils/errors/index.js'

export const handleValidationErrors = (req: Request) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const firstError = errors.array()[0]
		throw new BadRequestError(firstError?.msg || 'Validation error')
	}
}

export const getRequiredParam = (req: Request, paramName: string): string => {
	const value = req.params[paramName]
	if (!value) {
		throw new BadRequestError(`Missing required parameter: ${paramName}`)
	}
	return value
}
