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


	upsertOne: async (computerData: any, orgaId: string) => {
		const {
			hostname,
			platform,
			arch,
			version,
			parallelism,
			totalMemory,
			ip,
			homedir,
			cpus
		} = computerData;

		const computerComposedId = await getComposedIdentifier(computerData);
		try {

			const data = {
				composed_id: computerComposedId,
				hostname,
				organization: orgaId,
				arch,
				platform,
				os_version: version,
				home_dir: homedir,
				parallelism,
				total_memory: totalMemory,
				cpus,
				ip
			};

			let computer = await computerRepository.findOneBy({composed_id: computerComposedId});

			if (!computer) {
				computer = computerRepository.create(data);
			} else {
				Object.assign(computer, data);
			}

			const upsertedComputer = await computerRepository.save(computer);

			return upsertedComputer;
		} catch (err) {
			console.error(`Error upserting computer with composedID ${computerComposedId} : ${err}`);
			throw new Error(`Error upserting computer: ${err}`);
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