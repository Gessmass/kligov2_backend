import dataSource from "../config/db";
import {UsersHasDevices} from "../entities/users_has_devices";
import {Device} from "../entities/device";
import {User} from "../entities/user";

const usersHasDevicesServiceRepository = dataSource.getRepository(UsersHasDevices)

const usersHasDevicesService = {
	addOne: async (deviceId: string, userId: string): Promise<Boolean> => {
		return dataSource.transaction(async transactionentityManager => {
			try {
				const device = await transactionentityManager.findOne(Device, {where: {id: deviceId}})
				const user = await transactionentityManager.findOne(User, {where: {id: userId}})

				if (!device) {
					throw new Error(`Device not found for id ${deviceId}`)
				}
				if (!user) {
					throw new Error(`MAC not found for id ${userId}`);
				}

				const newUserHasDevice = new UsersHasDevices()

				newUserHasDevice.device = device
				newUserHasDevice.user = user

				await transactionentityManager.save(newUserHasDevice)

				return true
			} catch (err) {
				throw new Error(`Error creating usersHasDevicesService relation after activation: ${err}`);
			}

		})
	}
}

export default usersHasDevicesService