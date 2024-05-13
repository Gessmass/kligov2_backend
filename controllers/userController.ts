import {Request, Response} from "express";
import userService from "../services/userService";
import {validateUser} from "../validators/newUserValidator";
import {hashPassword} from "../helpers/argonHelper";

export type UserData = {
	firstname: string,
	lastname: string,
	type: string,
	email: string,
	password: string,
	organizationId: string
}

export const createOneUser = async (req: Request, res: Response) => {

	try {
		const errors = validateUser(req.body);
		if (errors) {
			console.log("Validate user error :", errors)
			return res.status(401).send(errors);
		}

		const {password}: UserData = req.body;
		const hashedPassword = await hashPassword(password);
		const createdUser = await userService.addOne({...req.body, password: hashedPassword});

		if (createdUser) {
			return res.status(201).send({newUserId: createdUser.id});
		} else {
			return res.status(400).send({message: "Unable to create user"});
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send("Internal Server Error");
	}
};
