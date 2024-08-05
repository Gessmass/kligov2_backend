import crypto from "crypto";

export const createComposedIdentifier = async (persistentMacAddresses: any) => {
	const hash = crypto.createHash('sha256')
	hash.update(persistentMacAddresses)
	return hash.digest('hex')
}