import Joi from "joi";
import {User} from "../entities/user";

export const validateLogin = (user: User) => {

	const schema = Joi.object({
		email: Joi.string().email().required(),
		plainPassword: Joi.string().min(6).max(30).required(),
		computerId: Joi.string(),
		computerData: Joi.object().required()
	});

	const {error} = schema.validate(user, {abortEarly: false});

	if (error) {
		const errorMessage = error.details.map((err) => ({
			message: err.message,
		}));

		return {errorsCount: error.details.length, errorMessage};
	}

	return false;
};