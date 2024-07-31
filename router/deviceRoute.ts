import express from "express";
import {
	activateDevice,
	createOneDevice,
	getAllDevices,
	getCreateDeviceFormOptions,
	getLockedDevicesByOrga,
	getLockedNetworkDevicesByOrga,
	getNetworkUnusedByOrga,
	getUnusedBleDevices,
	lendBleDevice,
	refreshDevicesList,
	renameDevice,
	setBleDeviceOwner
} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get('/get-create-form-options', getCreateDeviceFormOptions)
router.get('/get-locked-by-orga/:orgaId', getLockedDevicesByOrga)
router.get('/get-unused-and-shared-by-orga/:orgaId', getNetworkUnusedByOrga)
router.get('/get-locked-network-devices-by-orga/:orgaId', getLockedNetworkDevicesByOrga)
router.get('/refresh-auth-by-userid/:userId/:orgaId', refreshDevicesList)
router.get('/get-unused-ble-by-orga/:orgaId', getUnusedBleDevices)

router.post('/create', createOneDevice)
router.post('/set-ble-owner/', setBleDeviceOwner)
router.post('/activate', activateDevice)

router.put('/lend-ble-device/:deviceId', lendBleDevice)
router.put('/rename/:deviceId', renameDevice)


export default router
