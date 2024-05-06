import deviceService from "../services/deviceService";
import {Device} from "../entities/device";
import {Request, Response} from "express";

export const getAllDevices = async (_req: Request, res: Response) => {
	try {
		const data: Device[] = await deviceService.getAll();
		if (data && data.length > 0) {
			res.status(200).json(data);
		} else {
			res.status(200).json([]);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
}

export const getDevicesFromUser = async (req: Request, res: Response) => {
	const userId = req.params.userId

	try {
		const data: Device[] = await deviceService.getAllFromUser(userId);
		if (data && data.length > 0) {
			res.status(200).json(data);
		} else {
			res.status(200).json({message: `No devices found for user ${userId}`, devices: []});
		}
	} catch (err) {
		console.error(err);
		res.status(500).json("Internal Server Error");
	}
}