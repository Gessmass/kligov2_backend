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
			parallelism,
			totalMemory,
			network,
			homedir,
			cpus
		} = computerData

		try {
			const newComputer = computerRepository.create({
				arch,
				platform,
				hostname,
				os_version: version,
				home_dir: homedir,
				parallelism,
				total_memory: totalMemory,
				cpus,
				ip: network.en0[1].address
			});

			const createdComputer = await computerRepository.save(newComputer);

			return createdComputer;
		} catch (err) {
			throw new Error(`Error creating new computer at first launch : ${err}`)
		}
	},

	upsertOne: async (computerData: any, computerId: string) => {
		const {
			hostname,
			platform,
			arch,
			version,
			parallelism,
			totalMemory,
			network,
			homedir,
			cpus
		} = computerData;
		try {
			let computer = await computerRepository.findOne({where: {id: computerId}});

			if (!computer) {
				computer = computerRepository.create({id: computerId});
			}

			computer.hostname = hostname;
			computer.arch = arch;
			computer.platform = platform;
			computer.os_version = version;
			computer.home_dir = homedir;
			computer.parallelism = parallelism;
			computer.total_memory = totalMemory;
			computer.cpus = cpus;
			computer.ip = network.en0[1].address;

			return await computerRepository.save(computer);
		} catch (err) {
			throw new Error(`Error upserting computer ${computerId}: ${err}`);
		}
	},

	getOneById: async (computerId: string): Promise<Computer | null> => {
		try {
			const result = await computerRepository
				.createQueryBuilder('computer')
				.where('computer.id = :id', {id: computerId})
				.getOne()

			return result
		} catch (err) {
			throw new Error(`Error fetching computer role : ${err}`)
		}
	}
}

export default computerService