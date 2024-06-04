import typeService from "../services/typeService";
import {Request, Response} from "express";
import brandService from "../services/brandService";
import {Brand} from "../entities/brand";
import measurementService from "../services/measurementService";
import modelService from "../services/modelService";
import {ModelType} from "../entities/model_type";

export const getCreateModelFormData = async (_req: Request, res: Response) => {
	try {
		const types: ModelType[] = await typeService.getAll()

		const brands: Brand[] = await brandService.getAll()

		const measurements = await measurementService.getAll()

		res.status(200).json({
			types, brands, measurements
		})
	} catch (err) {
		console.error(err);
		res.status(500).send("Internal Server Error");
	}
}

export const createOneModel = async (req: Request, res: Response) => {
	try {
		const createdModel: any = await modelService.addOne(req.body)

		if (createdModel) {
			return res.sendStatus(201)
		} else {
			return res.status(400).send({message: "Unable to create new model"})
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
}