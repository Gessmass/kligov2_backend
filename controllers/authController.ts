import {Request, Response} from "express";
import {validateLogin} from "../validators/loginValidator";
import userService from "../services/userService";
import {createToken} from "../helpers/jwtHelper";
import {verifyPassword} from "../helpers/argonHelper";
import deviceService from "../services/deviceService";
import computerService from "../services/computerService";


export const login = async (req: Request, res: Response) => {
	const {email, plainPassword, computerData, computerId} = req.body

	console.log(req.body)

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

		const computer = await computerService.upsertOne(computerData, computerId)

		console.log("UPDATEDcoMpuTer", computer)

		const userAuthDevices = await deviceService.getAllWithChars(user.id)

		const sharedDevices = await deviceService.getSharedDevices(user.organization.id)
		console.log(sharedDevices)

		const token = createToken(user)

		//TODO Passer secure à True en prod
		res.cookie("auth_token", token, {httpOnly: true, secure: false})

		res.status(200).json({
			user,
			userAuthDevices,
			token,
			computer,
			sharedDevices
		})

	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
}


export const logout = (_req: Request, res: Response) => {
	res.clearCookie("auth_token").sendStatus(200)
}