import dataSource from "../config/db";
import {DeviceType} from "../entities/device_types";

const deviceTypesRepository = dataSource.getRepository(DeviceType)

const typeService = {

	getAll: async () => {
		try {
			const types = await deviceTypesRepository
				.createQueryBuilder('types')
				.getMany()

			return types
		} catch (err) {
			throw new Error(`Error fetching all device types : ${err}`)
		}
	}
}

export default typeService