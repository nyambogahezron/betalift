import { body, param, query, ValidationChain } from 'express-validator'

export const registerValidation = (): ValidationChain[] => [
	body('email')
		.isEmail()
		.withMessage('Please provide a valid email')
		.normalizeEmail(),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),
	body('username')
		.isLength({ min: 3, max: 30 })
		.withMessage('Username must be between 3 and 30 characters')
		.matches(/^[a-zA-Z0-9_]+$/)
		.withMessage('Username can only contain letters, numbers, and underscores'),
	body('displayName')
		.optional()
		.isLength({ max: 50 })
		.withMessage('Display name cannot exceed 50 characters'),
]

export const loginValidation = (): ValidationChain[] => [
	body('email')
		.isEmail()
		.withMessage('Please provide a valid email')
		.normalizeEmail(),
	body('password')
		.notEmpty()
		.withMessage('Password is required'),
]

export const idValidation = (): ValidationChain[] => [
	param('id')
		.isMongoId()
		.withMessage('Invalid ID format'),
]

export const paginationValidation = (): ValidationChain[] => [
	query('page')
		.optional()
		.isInt({ min: 1 })
		.withMessage('Page must be a positive integer'),
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be between 1 and 100'),
]
