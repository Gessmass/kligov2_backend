import {Request, Response} from "express";
import {validateLogin} from "../validators/loginValidator";
import userService from "../services/userService";
import {verifyPassword} from "../helpers/argonHelper";
import deviceService from "../services/deviceService";
import computerService from "../services/computerService";


export const login = async (req: Request, res: Response) => {
	const {email, plainPassword, computerData} = req.body
	
	try {
		const formatErrors = validateLogin(req.body)

		if (formatErrors) {
			console.log(formatErrors)
			return res.status(401).send("Input format error")
		}

		const user = await userService.findByEmail(email)

		if (!user) {
			return res.status(401).send("Invalid credentials")
		}

		const isValidPassword = await verifyPassword(plainPassword, user.password)


		if (!isValidPassword) {
			return res.status(401).send("Invalid credentials")
		}

		// @ts-ignore
		delete user.password;

		const computer = await computerService.upsertOne(computerData, user.organization.id)

		const userAuthDevices = await deviceService.getAllWithChars(user.id)

		const sharedDevices = await deviceService.getSharedDevices(user.organization.id)


		//TODO Passer secure à True en prod
		res.cookie("auth_token", {httpOnly: true, secure: false})

		res.status(200).json({
			user,
			userAuthDevices,
			computer,
			sharedDevices
		})

	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
}


export const logout = (_req: Request, res: Response) => {
	res.clearCookie("auth_token").sendStatus(200)
}