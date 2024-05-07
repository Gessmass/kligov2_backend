import jwt from 'jsonwebtoken'
import {User} from "../entities/user";

export const createToken = (user: User) => {
	const payload = {id: user.id, username: user.email}
	const secretKey = "0000"
	const options = {expiresIn: '1h'}

	return jwt.sign(payload, secretKey, options)
}

export const verifyToken = (token: string) => {
	const secretKey = "0000"

	try {
		return jwt.verify(token, secretKey)
	} catch (err) {
		return null
	}
}