import crypto from "crypto";

export const getComposedIdentifier = (computerData: any) => {
	const {hostname, platform, totalMemory, cpus, arch} = computerData

	const rawIdentifier = `${hostname} - ${cpus} - ${totalMemory} - ${platform} - ${arch}`

	const hash = crypto.createHash('sha256')
	hash.update(rawIdentifier)
	return hash.digest('hex')
}