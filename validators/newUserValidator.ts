import Joi from "joi";
import {UserData} from "../controllers/userController";

export const validateUser = (user: UserData) => {

	const result = Joi.object({
		firstname: Joi.string().min(1).max(20).required(),
		lastname: Joi.string().min(1).max(20).required(),
		type: Joi.string().min(3).max(20).required(),
		email: Joi.string().min(8).max(40).required(),
		password: Joi.string().min(6).max(40).required(),
		organizationId: Joi.string().min(10).max(65).required(),
	}).required()
		.min(1)
		.validate(user, {abortEarly: false}).error

	if (result) {
		const errorMessages = result.details.map((err) => ({
			message: err.message
		}))
		return {errorsCount: result.details.length, errorMessages}
	}
	return false
}