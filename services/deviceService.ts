import {Device} from "../entities/device";
import dataSource from "../config/db";
import {UserHasDevice} from "../entities/user_has_device";
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

	getAllFromUser: async (userId: string): Promise<Device[]> => {
		try {
			const devices = await dataSource.getRepository(UserHasDevice)
				.createQueryBuilder('userHasDevice')
				.leftJoinAndSelect("userHasDevice.device", "device")
				.where("userHasDevice.user = :userId", {userId})
				.getMany()

			return devices.map(ud => ud.device)
		} catch (err) {
			throw new Error(`Error fetching all devices from user: ${err}`)
		}
	},
	addOne: async (deviceData: DeviceData): Promise<Device | null> => {
		const {name, customName, type, mac, status, protocol, activationCode, macType, organizationId} = deviceData

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
	}
}

export default deviceService