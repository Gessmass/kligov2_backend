import {Request, Response} from "express";
import {validateLogin} from "../validators/loginValidator";
import userService from "../services/userService";
import {createToken} from "../helpers/jwtHelper";
import {verifyPassword} from "../helpers/argonHelper";
import deviceService from "../services/deviceService";


export const login = async (req: Request, res: Response) => {
	try {
		const formatErrors = validateLogin(req.body)

		if (formatErrors) {
			console.log(formatErrors)
			return res.status(401).send("Input format error")
		}

		const user = await userService.findByEmail(req.body.email)

		if (!user) {
			return res.status(401).send("Invalid credentials")
		}

		const isValidPassword = await verifyPassword(req.body.plainPassword, user.password)

		if (!isValidPassword) {
			return res.status(401).send("Invalid credentials")
		}

		// @ts-ignore
		delete user.password;

		const userAuthDevices = await deviceService.getAllWithChars(user.id)

		console.log("userAuthDevices", userAuthDevices)

		const token = createToken(user)

		const network_mode_activated = await

			//TODO Passer secure à True en prod
			res.cookie("auth_token", token, {httpOnly: true, secure: false})

		res.status(200).json({
			user,
			userAuthDevices,
			token
		})

	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
}


export const logout = (_req: Request, res: Response) => {
	res.clearCookie("auth_token").sendStatus(200)
}