import dataSource from "../config/db";
import {Measurement} from "../entities/measurement";

const measurementRepository = dataSource.getRepository(Measurement)

const measurementService = {
	getAll: async () => {
		try {
			const results = measurementRepository
				.createQueryBuilder('measurements')
				.getMany()

			return results
		} catch (err) {
			throw new Error(`Error fetching all measurement types : ${err}`)
		}
	}
}

export default measurementService