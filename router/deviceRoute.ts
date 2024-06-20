import express from "express";
import {
	activateBleDevice,
	activateNetworkDevice,
	createOneDevice,
	getAllDevices,
	getCreateDeviceFormOptions,
	getLockedDevicesByOrga,
	getLockedNetworkDevicesByOrga,
	getNetworkUnusedByOrga,
	lendBleDevice,
	refreshDevicesList,
	setBleDeviceOwner
} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get('/get-create-form-options', getCreateDeviceFormOptions)
router.get('/get-ble-locked-by-orga/:orgaId', getLockedDevicesByOrga)
router.get('/get-unused-and-shared-by-orga/:orgaId', getNetworkUnusedByOrga)
router.get('/get-locked-network-devices-by-orga/:orgaId', getLockedNetworkDevicesByOrga)
router.get('/refresh-auth-by-userid/:userId/:orgaId', refreshDevicesList)

router.post('/create', createOneDevice)
router.post('/activate-ble-device', activateBleDevice)
router.post('/activate-network-device', activateNetworkDevice)
router.post('/set-ble-owner/', setBleDeviceOwner)

router.put('/lend-ble-device', lendBleDevice)


export default router
