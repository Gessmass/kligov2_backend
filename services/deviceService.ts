import {Device} from "../entities/device";
import dataSource from "../config/db";
import {DeviceData} from "../controllers/deviceController";

const deviceRepository = dataSource.getRepository(Device)

const deviceService = {

	getAll: async (): Promise<Device[]> => {
		try {
			const devices = await deviceRepository
				.createQueryBuilder('device')
				.getMany()

			return devices
		} catch (err) {
			throw new Error(`Error fetching all devices: ${err}`)
		}
	},

	addOne: async (deviceData: DeviceData): Promise<Device | null> => {
		const {
			name,
			customName,
			type,
			mac,
			model,
			status,
			protocol,
			activationCode,
			macType,
			organizationId
		} = deviceData
		try {
			const result = await deviceRepository
				.createQueryBuilder('device')
				.insert()
				.into(Device)
				.values({
					name,
					type,
					status,
					mac,
					model,
					protocol,
					custom_name: customName,
					activation_code: activationCode,
					organization: {id: organizationId},
					mac_type: macType
				})
				.execute()

			const deviceId = result.identifiers[0].id

			const device = await deviceRepository.findOneBy({id: deviceId})

			return device
		} catch (err) {
			throw new Error(`Error creating new device : ${err}`)
		}
	},
	getAllWithChars: async (userId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('device')
				.leftJoinAndSelect('device.users', 'users_devices')
				.leftJoinAndSelect('device.characteristics', 'characteristics')
				.where('users_devices.user_id = :userId', {userId})
				.getMany();

			return result

		} catch (err) {
			throw new Error(`Error fetching user devices with their characteristics: ${err}`);
		}
	}
}

export default deviceService