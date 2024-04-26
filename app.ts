import express, {Express, Response, Request} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './router/index'


const app: Express = express()

app.use(cors({
	credentials: true,
	optionsSuccessStatus: 200
}))

app.use(express.json())
app.use(cookieParser())

app.get("/", (_req: Request, res: Response) => {
	res.status(200).send("On / from server")
})

app.use("/api", router)

app.get('*', (_req: Request, res: Response) => {
	res.status(404).json({message: "Not found"})
})
