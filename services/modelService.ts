import dataSource from "../config/db";
import {Model} from "../entities/model";
import {ModelsHasMeasures} from "../entities/models_has_measures";

const modelRepository = dataSource.getRepository(Model)

const modelService = {
	getAll: async () => {
		try {
			const results = await modelRepository
				.createQueryBuilder('models')
				.getMany()

			return results
		} catch (err) {
			throw new Error(`Error fetching all models: ${err}`)
		}
	},

	addOne: async (modelData: Model) => {
		const {name, type, brand, measurements, protocol} = modelData;

		try {
			const result = await modelRepository.save({
				name,
				protocol,
				brand,
				type
			});

			const modelId = result.id;

			if (modelId && measurements && measurements.length > 0) {


				await dataSource.getRepository(ModelsHasMeasures)
					.createQueryBuilder()
					.insert()
					.into(ModelsHasMeasures)
					.values({
						model_id: modelId,
						measurement_id: measurements
					})
					.execute();
			}

		} catch (err) {
			throw new Error(`Error creating new model : ${err}`);
		}
	}
}

export default modelService