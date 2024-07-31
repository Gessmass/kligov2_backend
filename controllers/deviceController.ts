import deviceService from "../services/deviceService";
import {Device, DeviceStatus} from "../entities/device";
import {Request, Response} from "express";
import modelService from "../services/modelService";
import organizationService from "../services/organizationService";
import {Model} from "../entities/model";
import macService from "../services/macService";
import {Mac} from "../entities/mac";

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
	const {orgaId} = req.params
	try {
		const bleLockedMacs: Mac[] = await macService.getAllLockedByDeviceSlot(orgaId)
		const networkLockedDevices: Device[] = await deviceService.getNetworkLockedByOrga(orgaId)

		res.status(200).json({bleLockedMacs, networkLockedDevices})
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
	const {userId, deviceId} = req.body
	try {
		const transactionresult = await macService.setOwner(deviceId, userId)

		if (transactionresult) {
			return res.status(200).json("Device successfully lent")
		}
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const activateDevice = async (req: Request, res: Response) => {
	const {device, activationCode, customName, organizationId, userId} = req.body

	console.log(req.body)

	try {
		if (device.model.protocol === 'ble') {
			const lockedMac: Mac | null = await macService.getOneLocked(device.addr.replace(/^\[\d+\]/, '').toLowerCase())

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

			if (matchingDeviceByModel.activation_code.toString() === activationCode.toString()) {

				const updatedDevice: Device = await deviceService.updateAfterActivate(matchingDeviceByModel.id, customName, lockedMac.id)
				const updatedMac = await macService.updateAfterActivate(lockedMac.addr, updatedDevice.id, userId)

				if (updatedDevice && updatedMac) {
					return res.status(200).send("Device successfully activated")
				}
			} else {
				res.status(401).send("Invalid activation code")
			}
		} else if (device.model.protocol === 'network') {

			const matchingDevice = await deviceService.getOne(device.id)

			console.log(matchingDevice)

			if (!matchingDevice) {
				return res.status(500).send('Device not found in database')
			}

			if (matchingDevice.activation_code.toString() === activationCode.toString()) {
				const updatedDevice = await deviceService.updateAfterActivate(device.id, customName, null)

				if (updatedDevice) {
					return res.status(200).send('Device successfully activated')
				}
			} else {
				res.status(401).send('Invalid activation code')
			}
		}

	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const renameDevice = async (req: Request, res: Response) => {
	try {
		const updateResult = await deviceService.rename(req.params.deviceId, req.body.name)

		if (updateResult.affected && updateResult.affected > 0) {
			return res.status(200).json("Device successfully renamed")
		}
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const getUnusedBleDevices = async (req: Request, res: Response) => {
	try {
		const unusedBleDevices = await deviceService.getUnusedByOrga(req.params.orgaId)

		if (unusedBleDevices && unusedBleDevices.length > 0) {
			return res.status(200).json(unusedBleDevices)
		}
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const lendBleDevice = async (req: Request, res: Response) => {
	try {
		const updateResult = await macService.removeOwner(req.params.deviceId)

		if (updateResult) {
			return res.status(200).json("Device successfully lent")
		}
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}