import mongoose from 'mongoose'
import ENV from '../../config/env.js'
import { seedUsers } from './userSeeder.js'
import { seedProjects } from './projectSeeder.js'
import { seedFeedback } from './feedbackSeeder.js'
import { logger } from '../../utils/logger.js'

const seedDatabase = async () => {
	try {
		// Connect to database
		await mongoose.connect(ENV.mongodbUri)
		logger.info('Connected to MongoDB')

		// Clear existing data (optional - comment out if you want to keep existing data)
		logger.info('Clearing existing data...')
		await mongoose.connection.db?.dropDatabase()
		logger.info('Database cleared')

		// Seed data in order
		logger.info('Starting database seeding...')
		
		const users = await seedUsers()
		logger.info(`✓ Seeded ${users.length} users`)

		const projects = await seedProjects(users)
		logger.info(`✓ Seeded ${projects.length} projects`)

		const feedback = await seedFeedback(users, projects)
		logger.info(`✓ Seeded ${feedback.length} feedback items`)

		logger.info('Database seeding completed successfully!')
		process.exit(0)
	} catch (error) {
		logger.error('Error seeding database:', error)
		process.exit(1)
	}
}

// Run seeder
seedDatabase()
