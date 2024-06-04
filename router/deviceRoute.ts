import express from "express";
import {
	activateDevice,
	createOneDevice,
	getAllDevices,
	getCreateDeviceFormOptions,
	getLockedDevicesByOrga,
	getUnusedAndSharedByOrga
} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get('/get-create-form-options', getCreateDeviceFormOptions)
router.get('/get-locked-by-orga/:orgaId', getLockedDevicesByOrga)
router.get('/get-unused-and-shared-by-orga', getUnusedAndSharedByOrga)

router.post('/create', createOneDevice)
router.post('/activate', activateDevice)

export default router
