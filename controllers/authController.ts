import {Request, Response} from "express";
import {validateLogin} from "../validators/loginValidator";
import userService from "../services/userService";
import {createToken} from "../helpers/jwtHelper";


/* export const login = async (req: Request, res: Response) => {
	try {
		const formatErrors = validateLogin(req.body)

		if (formatErrors) {
			return res.status(401).send(formatErrors)
		}

		const user = await userService.findByEmail(req.body.email)
		console.log("User in authController", user)

		if (!user) {
			return res.status(401).send("Invalid credentials")
		}

		const passwordVerification = await verifyPassword(req.body.plainPassword, user.password)

		if (!passwordVerification) {
			return res.status(401).send("Invalid credentials")
		}

		// @ts-ignore
		delete user.password;

		const token = createToken(user)

		//TODO Passer secure à True en prod
		res.cookie("auth_token", token, {httpOnly: true, secure: false})

		res.status(200).json({user: user.email})
	} catch (err) {
		console.log(err)
		res.sendStatus(500)
	}
} */
export const login = async (req: Request, res: Response) => {
	try {
		const formatErrors = validateLogin(req.body)

		if (formatErrors) {
			console.log(formatErrors)
			return res.status(401).send("Input format error")
		}

		const user = await userService.findByEmail(req.body.email)
		console.log("User in authController", user)

		if (!user) {
			return res.status(401).send("Invalid credentials")
		}

		const passwordVerification = req.body.plainPassword === user.password

		if (!passwordVerification) {
			return res.status(401).send("Invalid credentials")
		}

		// @ts-ignore
		delete user.password;

		const token = createToken(user)

		//TODO Passer secure à True en prod
		res.cookie("auth_token", token, {httpOnly: true, secure: false})

		res.status(200).json({
			user: {
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
			},
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