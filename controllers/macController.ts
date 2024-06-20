import {Request, Response} from "express";
import macService from "../services/macService";

export const getAllLockedAddresses = async (_req: Request, res: Response) => {
	try {
		const lockedAddresses = await macService.getAllLocked()

		return res.status(200).json(lockedAddresses)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const createMacAddress = async (req: Request, res: Response) => {
	try {
		const createdMAc = await macService.addOne(req.body)

		if (createdMAc) {
			return res.status(201).send("MAC address created successfully !")
		}

	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}