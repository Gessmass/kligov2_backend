import {Request, Response} from "express";
import typeService from "../services/typeService";

export const getAllDeviceTypes = async (req: Request, res: Response) => {
	try {
		const types = await typeService.getAll()

		res.status(200).json(types)
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
}