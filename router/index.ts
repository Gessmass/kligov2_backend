import express from 'express'
import deviceRoute from "./deviceRoute";
import userRoute from "./userRoute";
import authRoute from "./authRoute";
import organizationRoute from "./organizationRoute";
import modelRoute from "./modelRoute";
import typeRoute from './typeRoute';
import computerRoute from "./computerRoute";

const router = express.Router()

router.use('/auth', authRoute)

router.use('/organizations', organizationRoute)
router.use('/devices', deviceRoute)
router.use('/users', userRoute)
router.use('/models', modelRoute)
router.use('/types', typeRoute)
router.use('/computers', computerRoute)

export default router