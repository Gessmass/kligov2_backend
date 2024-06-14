import crypto from "crypto";

export const getComposedIdentifier = async (computerData: any) => {
	const {hostname, platform, cpus, arch, homedir} = computerData

	const rawIdentifier = `${hostname} - ${cpus} - ${platform} - ${arch} - ${homedir}`

	const hash = crypto.createHash('sha256')
	hash.update(rawIdentifier)
	return hash.digest('hex')
}