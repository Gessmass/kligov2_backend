import {Device} from "../entities/device";
import dataSource from "../config/db";
import {DeviceData} from "../controllers/deviceController";
import {UserHasDevice} from "../entities/user_has_device";

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
	getAllWithChars: async (userId: string): Promise<DeviceWithCharacteristics[]> => {
		try {
			// Start with the UserHasDevice repository if you're using TypeORM
			const devices = await dataSource.getRepository(UserHasDevice)
				.createQueryBuilder('userHasDevice')
				.leftJoinAndSelect('userHasDevice.device', 'device')
				.leftJoinAndSelect('device.characteristics', 'characteristics')
				.where('userHasDevice.user_id = :userId', { userId })
				.getMany();

			// Extract devices with their characteristics
			const result = devices.map(ud => ({
				...ud.device,
				characteristics: ud.device.characteristics
			}));

			return result;
		} catch (err) {
			throw new Error(`Error fetching user devices with their characteristics: ${err}`);
		}
	};
}

export default deviceService