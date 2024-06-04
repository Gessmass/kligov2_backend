import dataSource from "../config/db";
import {ModelType} from "../entities/model_type";

const modelTypesRepository = dataSource.getRepository(ModelType)

const typeService = {

	getAll: async () => {
		try {
			const types = await modelTypesRepository
				.createQueryBuilder('types')
				.getMany()

			return types
		} catch (err) {
			throw new Error(`Error fetching all device types : ${err}`)
		}
	}
}

export default typeService