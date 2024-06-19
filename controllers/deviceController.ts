import deviceService from "../services/deviceService";
import {Device, DeviceStatus} from "../entities/device";
import {Request, Response} from "express";
import modelService from "../services/modelService";
import organizationService from "../services/organizationService";
import {Model} from "../entities/model";
import macService from "../services/macService";
import {Mac} from "../entities/mac";
import usersHasDevicesService from "../services/usersHasDevicesService";
import UsersHasDevicesService from "../services/usersHasDevicesService";

export type DeviceData = {
	mac: string,
	model: Model,
	status: DeviceStatus,
	activationCode: string,
	organizationId: string,
}
export const getAllDevices = async (_req: Request, res: Response) => {
	try {
		const data: Device[] = await deviceService.getAll();
		if (data && data.length > 0) {
			return res.status(200).json(data);
		} else {
			return res.status(200).json([]);
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
}

export const createOneDevice = async (req: Request, res: Response) => {
	try {
		const createdDevice: Device | null = await deviceService.addOne(req.body)

		if (createdDevice) {
			return res.status(201).send({newDevice: createdDevice})
		} else {
			return res.status(400).send("Unable to create device")
		}
	} catch (err) {
		console.error(err);
		res.status(500).json("Internal Server Error");
	}
}

export const activateBleDevice = async (req: Request, res: Response) => {
	const {deviceAddr, sentCode, customName, organizationId, userId} = req.body

	console.log(req.body)

	try {
		const lockedMac: Mac | null = await macService.getOneLocked(deviceAddr.toLowerCase())

		console.log(lockedMac)

		if (!lockedMac) {
			return res.status(400).send("Unknown device, please select another one");
		}

		const availableDeviceSlotsByOrga: Device[] = await deviceService.getLockedByOrga(organizationId)

		if (availableDeviceSlotsByOrga.length === 0) {
			return res.status(400).send("No available slot found for your organization")
		}

		const matchingDeviceByModel = availableDeviceSlotsByOrga.find(slot => slot.model.id === lockedMac.model.id)
		console.log(matchingDeviceByModel)

		if (!matchingDeviceByModel) {
			return res.status(400).send("No slot available for this kind of device")
		}

		if (matchingDeviceByModel.activation_code.toString() === sentCode.toString()) {

			const updatedDevice: Device = await deviceService.updateAfterActivate(matchingDeviceByModel.id, customName, lockedMac.id)
			const updatedMac = await macService.updateAfterActivate(lockedMac.addr, updatedDevice.id)
			const createdDeviceOwningRelationship: Boolean = await usersHasDevicesService.addOne(updatedDevice.id, userId)

			if (updatedDevice && updatedMac && createdDeviceOwningRelationship) {
				return res.status(200).send("Device successfully activated")
			}
		} else {
			res.status(423).send("Invalid activation code")
		}

	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const activateNetworkDevice = async (req: Request, res: Response) => {
	try {
		const {sentCode, customName, deviceId} = req.body

		const matchingDevice = await deviceService.getOne(deviceId)

		if (!matchingDevice) {
			return res.status(500).send('Device not found in database')
		}

		if (matchingDevice.activation_code.toString() === sentCode.toString()) {
			const updatedDevice = await deviceService.updateAfterActivate(deviceId, customName, null)

			if (updatedDevice) {
				return res.status(200).send('Device successfully activated')
			}
		} else {
			res.status(423).send('Invalid activation code')
		}
	} catch (err) {
		res.status(500).send("Internal server error")
	}
}

export const getCreateDeviceFormOptions = async (req: Request, res: Response) => {
	try {
		const models = await modelService.getAll()
		const organizations = await organizationService.getAll()

		res.status(200).json({models, organizations})
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const getLockedDevicesByOrga = async (req: Request, res: Response) => {
	try {
		const devices: Device[] = await deviceService.getLockedByOrga(req.params.orgaId)

		res.status(200).json(devices)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const getLockedNetworkDevicesByOrga = async (req: Request, res: Response) => {
	try {
		const devices: Device[] = await deviceService.getNetworkLockedByOrga(req.params.orgaId)

		res.status(200).json(devices)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const getNetworkUnusedByOrga = async (req: Request, res: Response) => {
	try {
		const lockedDevices: Device[] = await deviceService.getLockedByOrga(req.params.orgaId)

		const networkDevices: Device[] = await deviceService.getNetworkDevicesByOrgaId(req.params.orgaId)

		return res.status(200).json(...lockedDevices, ...networkDevices)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const lendBleDevice = async (req: Request, res: Response) => {
	const {deviceId, userId, orgaId} = req.body
	try {
		const deletedRow = await UsersHasDevicesService.deleteOne(deviceId)

		if (deletedRow) {
			const userAuthDevices = await deviceService.getAllByUserIdWithChars(userId)
			const networkDevices = await deviceService.getNetworkDevicesByOrgaId(orgaId)
			const freeBleDevices = await deviceService.getFreeBleByOrga(orgaId)

			return res.status(200).json({userAuthDevices, networkDevices, freeBleDevices})
		} else {
			res.status(500).send("Unable to update owning relationship")
		}
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const refreshDevicesList = async (req: Request, res: Response) => {
	const {userId, orgaId} = req.params
	try {
		const userAuthDevices = await deviceService.getAllByUserIdWithChars(userId)
		const networkDevices = await deviceService.getNetworkDevicesByOrgaId(orgaId)
		const freeBleDevices = await deviceService.getFreeBleByOrga(orgaId)

		return res.status(200).json({userAuthDevices, networkDevices, freeBleDevices})
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const setBleDeviceOwner = async (req: Request, res: Response) => {
	const {userId, deviceId, orgaId} = req.body
	try {
		const createdDeviceOwningRelation: Boolean = await usersHasDevicesService.addOne(deviceId, userId)

		if (createdDeviceOwningRelation) {
			const userAuthDevices = await deviceService.getAllByUserIdWithChars(userId)
			const networkDevices = await deviceService.getNetworkDevicesByOrgaId(orgaId)
			const freeBleDevices = await deviceService.getFreeBleByOrga(orgaId)

			return res.status(200).json({userAuthDevices, networkDevices, freeBleDevices})
		} else {
			res.status(500).send("Internal server error")
		}

	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}
