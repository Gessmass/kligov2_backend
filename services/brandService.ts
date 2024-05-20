import dataSource from "../config/db";
import {Brand} from "../entities/brand";

const brandRepository = dataSource.getRepository(Brand)

const brandService = {

	getAll: async () => {
		try {
			const result = await brandRepository
				.createQueryBuilder('brands')
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching all brands : ${err}`)
		}
	}
}

export default brandService