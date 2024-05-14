import deviceService from "../services/deviceService";
import {ComProtocol, Device, DeviceStatus, DeviceType, MacType} from "../entities/device";
import {Request, Response} from "express";

export type DeviceData = {
	name: string,
	customName: string,
	type: DeviceType,
	mac: string,
	model: string,
	status: DeviceStatus,
	protocol: ComProtocol,
	activationCode: string,
	organizationId: string,
	macType: MacType
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