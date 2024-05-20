import express from "express";
import {getAllDeviceTypes} from "../controllers/typeController";

const router = express.Router()

router.use('/', getAllDeviceTypes)

export default router