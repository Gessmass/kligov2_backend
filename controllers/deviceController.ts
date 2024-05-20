import deviceService from "../services/deviceService";
import {Device, DeviceStatus, MacType} from "../entities/device";
import {Request, Response} from "express";
import {UpdateResult} from "typeorm";
import modelService from "../services/modelService";
import organizationService from "../services/organizationService";
import {Model} from "../entities/model";

export type DeviceData = {
	mac: string,
	model: Model,
	status: DeviceStatus,
	activationCode: string,
	organizationId: string,
	macType: MacType,
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

export const activateDevice = async (req: Request, res: Response) => {
	const {deviceAddr, sentCode, customName} = req.body

	try {
		const device = await deviceService.getOneByMac(deviceAddr)

		console.log("activateDevice", device)

		if (!device) {
			return res.status(400).send("No device found");
		}

		console.log(sentCode, device.activation_code)

		if (parseInt(sentCode) === parseInt(device.activation_code)) {

			const result: UpdateResult = await deviceService.updateAfterActivate(device.id, customName)
			if (result.affected) {
				return res.status(200).send("Device successfully activated")
			}

		} else {
			return res.status(401).send("Invalid activation code")
		}

	} catch (err) {
		console.error(err)
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
