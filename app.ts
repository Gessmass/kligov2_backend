import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import 'reflect-metadata'

import router from './router/index'

dotenv.config({path: "/Users/martin/Documents/github_transferts/carz/.env"});


const app = express()

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
	optionsSuccessStatus: 200
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (_req, res) => {
	res.status(200).send("On / from server")
})

app.use("/api", router)

app.get('*', (_req, res) => {
	res.status(404).json({message: "Not found"})
})

export default app

