import {Computer} from "../entities/computer";
import dataSource from "../config/db";
import {getComposedIdentifier} from "../helpers/idHelper";

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


	upsertOne: async (computerData: any, computerId: string | null, orgaId: string) => {
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
			const data: any = {
				id: computerId,
				composed_identifier: getComposedIdentifier(computerData),
				hostname,
				organization: orgaId,
				arch,
				platform,
				os_version: version,
				home_dir: homedir,
				parallelism,
				total_memory: totalMemory,
				cpus,
				ip: network.en0[1].address
			};

			const upsertedComputer = await computerRepository.save(data);

			// Optionally re-fetch the computer from the database to ensure you have the latest state
			const freshComputer = await computerRepository.findOne({where: {id: upsertedComputer.id}});

			console.log(freshComputer);
			return freshComputer;
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
	},
}

export default computerService