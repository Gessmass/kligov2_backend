import * as argon2 from "argon2";

const hashingOptions: object = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16,
	timeCost: 5,
	parallelism: 1
}

const hashPassword = (plainPassword: string) => {
	return argon2.hash(plainPassword, hashingOptions)
}

export const verifyPassword = (plainPwd: string, hashedPwd: string) => {
	return argon2.verify(plainPwd, hashedPwd, hashingOptions)
}

