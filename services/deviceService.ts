import {Device} from "../entities/device";
import dataSource from "../config/db";
import {UserHasDevice} from "../entities/user_has_device";


const deviceService = {

	getAll: async (): Promise<Device[]> => {
		try {
			const devices = await dataSource.getRepository(Device)
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
	}
}

export default deviceService