import dataSource from "../config/db";
import {Organization} from "../entities/organization";

const organizationService = {
	getAll: async () => {
		try {
			const organizations = await dataSource.getRepository(Organization)
				.createQueryBuilder('organization')
				.getMany()

			return organizations
		} catch (err) {
			throw new Error(`Error fetching all devices: ${err}`)
		}
	}
}

export default organizationService