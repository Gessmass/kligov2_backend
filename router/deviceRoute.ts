import express from "express";
import {
	activateDevice,
	createOneDevice,
	getAllDevices,
	getCreateDeviceFormOptions
} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get('/get-create-form-options', getCreateDeviceFormOptions)

router.post('/create', createOneDevice)
router.post('/activate', activateDevice)

export default router
