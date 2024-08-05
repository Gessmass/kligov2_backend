import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'reflect-metadata'

import router from './router/index'
import dataSource from "./config/db";

dotenv.config()

const app = express()

app.use(cors({
	origin: '*',
	credentials: true,
	optionsSuccessStatus: 200,
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (_req, res) => {
	res.status(200).send("On / from server")
})

app.post('/health-check-computer-id', (_req, res) => {
	res.sendStatus(200)
	console.log("health-checked")
})

app.use("/api", router)

app.get('*', (_req, res) => {
	res.status(404).json({message: "Not found"})
})

const port = parseInt(process.env.SERVER_PORT!) || 3000

const start = async () => {
	try {
		await dataSource.initialize();
		console.log("Datasource has been initialized");

		app.listen(port, '0.0.0.0', () => {
			console.log(`Backend server is listening on ${port}`);
		}).on('error', (err) => {
			console.log(err);
		});
	} catch (err) {
		console.error("Error during Datasource initialization", err);
	}
}

start();


export default app

