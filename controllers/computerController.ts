import {Request, Response} from "express";
import computerService from "../services/computerService";

export const getComputerRole = async (req: Request, res: Response) => {
	try {
		const computer = await computerService.getOneById(req.params.computerId)

		return res.status(200).json(computer)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}
