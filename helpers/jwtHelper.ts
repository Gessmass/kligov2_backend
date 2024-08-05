import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {NextFunction, Request, Response} from 'express'

dotenv.config()

const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
	throw new Error('JWT_SECRET_KEY is not defined');
}

const refreshTokenSecret = process.env.JWT_REFRESH_SECRET_KEY
if (!refreshTokenSecret) {
	throw new Error('JWT_REFRESH_SECRET_KEY is not defined');
}

export const createAuthToken = (user: any) => {
	return jwt.sign({
		id: user.id,
		email: user.email,
		organization: user.organization.id
	}, secretKey, {expiresIn: '15m'});
};

export const createRefreshToken = (user: any) => {
	return jwt.sign({
		id: user.id,
		email: user.email,
		organization: user.organization.id
	}, refreshTokenSecret, {expiresIn: '7d'});
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.auth_token;
	if (!token) return res.sendStatus(401);

	jwt.verify(token, secretKey, (err: any, _decodedUser: any) => {
		if (err) return res.sendStatus(403);
		next();
	});
};

export const verifyRefreshToken = (refreshToken: string) => {
	return jwt.verify(refreshToken, refreshTokenSecret);
};