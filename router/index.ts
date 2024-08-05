import express from 'express'
import deviceRoute from "./deviceRoute";
import userRoute from "./userRoute";
import authRoute from "./authRoute";
import organizationRoute from "./organizationRoute";
import modelRoute from "./modelRoute";
import typeRoute from './typeRoute';
import computerRoute from "./computerRoute";
import macRoute from "./macRoute";
import {sendEmailToSupport} from "../email";
import {verifyToken} from "../helpers/jwtHelper";

const router = express.Router()

router.use('/auth', authRoute)

router.use(verifyToken)

router.use('/organizations', organizationRoute)
router.use('/devices', deviceRoute)
router.use('/users', userRoute)
router.use('/models', modelRoute)
router.use('/types', typeRoute)
router.use('/computers', computerRoute)
router.use('/macs', macRoute)

router.post('/contact', sendEmailToSupport)

export default router