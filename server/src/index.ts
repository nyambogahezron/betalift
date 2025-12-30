import express, { Application, Request, Response } from 'express'
import ENV from './config/env'
import { debug } from 'util'

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, Betalift API!')
})

const server = app.listen(ENV.port, () => {
	console.log(`Server is running on http://localhost:${ENV.port}`)
})

process.on('SIGTERM', () => {
	debug('SIGTERM signal received: closing HTTP server')
	server.close(() => {
		debug('HTTP server closed')
	})
})

