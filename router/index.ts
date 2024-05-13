import express from 'express'
import deviceRoute from "./deviceRoute";
import userRoute from "./userRoute";
import authRoute from "./authRoute";
import organizationRoute from "./organizationRoute";

const router = express.Router()

router.use('/auth', authRoute)

router.use('/organizations', organizationRoute)
router.use('/devices', deviceRoute)
router.use('/users', userRoute)

export default router