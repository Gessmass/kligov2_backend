import {Request, Response} from "express";
import computerService from "../services/computerService";
import {Computer} from "../entities/computer";

export const createNewComputer = async (req: Request, res: Response) => {
	const {computerData} = req.body
	console.log(computerData)

	try {
		const createdComputer: Computer | null = await computerService.addOne(computerData)

		if (createdComputer) {
			return res.status(200).json(createdComputer.id)
		}

	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const getComputerRole = async (req: Request, res: Response) => {
	try {
		const computer = await computerService.getOneById(req.params.computerId)

		return res.status(200).json(computer)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}

export const updateComputerById = async (req: Request, res: Response) => {
	const {computerId, computerData} = req.body
	try {
		const computer = await computerService.updateOneById(computerId, computerData)

		return res.status(200).json(computer)
	} catch (err) {
		console.error(err)
		res.status(500).send("Internal server error")
	}
}