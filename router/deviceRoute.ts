import express from "express";
import {
	activateBleDevice,
	activateNetworkDevice,
	createOneDevice,
	getAllDevices,
	getCreateDeviceFormOptions,
	getLockedDevicesByOrga,
	getLockedNetworkDevicesByOrga,
	getUnusedAndSharedByOrga
} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get('/get-create-form-options', getCreateDeviceFormOptions)
router.get('/get-locked-by-orga/:orgaId', getLockedDevicesByOrga)
router.get('/get-unused-and-shared-by-orga/:orgaId', getUnusedAndSharedByOrga)
router.get('/get-locked-network-devices-by-orga/:orgaId', getLockedNetworkDevicesByOrga)

router.post('/create', createOneDevice)
router.post('/activate-ble-device', activateBleDevice)
router.post('/activate-network-device', activateNetworkDevice)

export default router
