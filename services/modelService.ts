import dataSource from "../config/db";
import {Model} from "../entities/model";
import {Measurement} from "../entities/measurement";
import {ModelHasMeasurement} from "../entities/model_has_measurement";

const modelRepository = dataSource.getRepository(Model);
const measurementRepository = dataSource.getRepository(Measurement);

const modelService = {
	getAll: async (): Promise<Model[]> => {
		try {
			return await modelRepository.find();
		} catch (err: any) {
			throw new Error(`Error fetching all models: ${err.message}`);
		}
	},

	addOne: async (modelData: Omit<Model, 'id'> & { measurements: string[] }): Promise<Model> => {
		const {name, protocol, brand, measurements} = modelData;

		return await dataSource.transaction(async transactionalEntityManager => {
			try {
				const newModel = new Model();
				newModel.name = name;
				newModel.protocol = protocol;
				newModel.brand = brand;

				const savedModel = await transactionalEntityManager.save(newModel);

				if (measurements && measurements.length > 0) {
					const measurementEntities = await measurementRepository.findByIds(measurements);

					const modelMeasurements = measurementEntities.map(measurement => {
						const modelMeasurement = new ModelHasMeasurement();
						modelMeasurement.model = savedModel;
						modelMeasurement.measurement = measurement; // Directly assign the measurement entity
						return modelMeasurement;
					});

					await transactionalEntityManager.save(modelMeasurements);
				}

				return savedModel;
			} catch (err: any) {
				throw new Error(`Error creating new model: ${err.message}`);
			}
		});
	}
};

export default modelService;
