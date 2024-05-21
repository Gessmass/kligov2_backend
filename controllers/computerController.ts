import {Request, Response} from "express";
import computerService from "../services/computerService";
import {Computer} from "../entities/computer";

export const storeDataAtFirstLaunch = async (req: Request, res: Response) => {
	console.log(req.body.computerInfos)
	try {
		const createdComputer: Computer | null = await computerService.addOne(req.body.computerInfos)

		if (createdComputer) {
			return res.status(200).json(createdComputer)
		}

	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}