import {Request, Response} from "express";
import organizationService from "../services/organizationService";
import {Organization} from "../entities/organization";

export const getAllOrganizations = async (_req: Request, res: Response) => {
	try {
		const data: Organization[] = await organizationService.getAll();
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