import {Computer} from "../entities/computer";
import dataSource from "../config/db";

const computerRepository = dataSource.getRepository(Computer);

const computerService = {
	addOne: async (computerData: any): Promise<Computer | null> => {
		const {
			hostname,
			platform,
			arch,
			version,
			userInfos,
			parallelism,
			totalMemory,
			network,
			homedir,
			cpus
		} = computerData

		console.log("network", network)
		console.log("userInfos", userInfos)

		try {
			const newComputer = computerRepository.create({
				arch,
				platform,
				hostname,
				os_version: version,
				home_dir: homedir,
				parallelism,
				total_memory: totalMemory,
				cpus
			});

			const createdComputer = await computerRepository.save(newComputer);

			return createdComputer;
		} catch (err) {
			throw new Error(`Error creating new computer at first launch : ${err}`)
		}
	}
}

export default computerService