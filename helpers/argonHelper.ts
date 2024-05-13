import * as argon2 from "argon2";

const hashingOptions: object = {
	type: argon2.argon2id,
	memoryCost: 2 ** 16,
	timeCost: 3,
	parallelism: 1,
	hashLength: 32
}

export const hashPassword = (plainPassword: string) => {
	return argon2.hash(plainPassword, hashingOptions)
}

export const verifyPassword = async (plainPwd: string, hashedPwd: string): Promise<boolean> => {
	try {
		return await argon2.verify(hashedPwd, plainPwd);
	} catch (err) {
		console.error('Error verifying password:', err);
		throw err;
	}
};

