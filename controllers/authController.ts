import {Request, Response} from "express";
import {validateLogin} from "../validators/loginValidator";
import userService from "../services/userService";
import {verifyPassword} from "../helpers/argonHelper";
import deviceService from "../services/deviceService";
import computerService from "../services/computerService";
import {createAuthToken, createRefreshToken, verifyRefreshToken} from "../helpers/jwtHelper";
import {JwtPayload} from "jsonwebtoken";
import {User} from "../entities/user";

export const login = async (req: Request, res: Response) => {
	const {email, plainPassword, computerData} = req.body;

	console.log(req.body)

	try {
		const formatErrors = validateLogin(req.body);

		if (formatErrors) {
			console.log(formatErrors);
			return res.status(400).json({message: "Input format error", errors: formatErrors});
		}

		const user = await userService.findByEmail(email);

		if (!user) {
			return res.status(401).json({message: "Invalid credentials"});
		}

		const isValidPassword = await verifyPassword(plainPassword, user.password);

		if (!isValidPassword) {
			return res.status(401).json({message: "Invalid credentials"});
		}

		// @ts-ignore
		delete user.password;

		const token = createAuthToken(user);
		const refreshToken = createRefreshToken(user);

		const computer = await computerService.upsertOne(computerData, user.organization.id);
		const userAuthDevices = await deviceService.getAllByUserIdWithChars(user.id);
		const networkDevices = await deviceService.getNetworkDevicesByOrgaId(user.organization.id);

		const isProduction = !process.env.IS_DEV;

		res.cookie("auth_token", token, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'strict' : 'lax',
			maxAge: 15 * 60 * 1000 // 15 min
		});

		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'strict' : 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});

		res.status(200).json({
			user,
			userAuthDevices,
			computer,
			networkDevices,
		});
		
	} catch (err) {
		console.log(err);
		res.status(500).json({message: "Internal server error"});
	}
}

export const logout = (_req: Request, res: Response) => {
	res.clearCookie("auth_token");
	res.clearCookie("refresh_token");
	res.sendStatus(200);
}

export const refreshToken = async (req: Request, res: Response) => {
	const {refreshToken} = req.cookies;

	try {
		if (!refreshToken) {
			return res.status(401).json({message: "No refresh token provided"});
		}

		const decoded: JwtPayload | string = verifyRefreshToken(refreshToken);

		console.log("decoded", decoded)

		const user: User | null = await userService.findOneById(decoded);

		if (!user) {
			return res.status(401).json({message: "Invalid refresh token"});
		}

		const newAccessToken = createAuthToken(user);

		res.cookie("auth_token", newAccessToken, {
			httpOnly: true,
			secure: !process.env.IS_DEV,
			sameSite: !process.env.IS_DEV ? 'strict' : 'lax',
			maxAge: 15 * 60 * 1000 // 15 min
		});

		res.status(200).json({message: "Token refreshed"});

	} catch (err) {
		console.log(err);
		res.status(500).json({message: "Internal server error"});
	}
};
