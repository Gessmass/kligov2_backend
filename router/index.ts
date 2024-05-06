import express from 'express'
import deviceRoute from "./deviceRoute";

const router = express.Router()

router.use('/devices', deviceRoute)

export default router