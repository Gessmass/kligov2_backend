import {Device, DeviceStatus} from "../entities/device";
import dataSource from "../config/db";
import {DeviceData} from "../controllers/deviceController";

const deviceRepository = dataSource.getRepository(Device)

const deviceService = {

	getAll: async (): Promise<Device[]> => {
		try {
			const devices = await deviceRepository
				.createQueryBuilder('devices')
				.getMany()

			return devices
		} catch (err) {
			throw new Error(`Error fetching all devices: ${err}`)
		}
	},

	addOne: async (deviceData: DeviceData): Promise<Device | null> => {
		const {
			mac,
			status,
			activationCode,
			macType,
			organizationId,
			model
		} = deviceData
		try {
			const result = await deviceRepository
				.createQueryBuilder('devices')
				.insert()
				.into(Device)
				.values({
					status,
					mac,
					activation_code: activationCode,
					organization: {id: organizationId},
					mac_type: macType,
					model
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
				.createQueryBuilder('devices')
				.leftJoinAndSelect('devices.users', 'users_devices')
				.where('users_devices.user_id = :userId', {userId})
				.andWhere('devices.status = :status', {status: "active"})
				.getMany();

			return result

		} catch (err) {
			throw new Error(`Error fetching user devices with their characteristics: ${err}`);
		}
	},

	getOneByMac: async (macAddr: string): Promise<Device | null> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('devices')
				.where('devices.mac = :macAddr', {macAddr})
				.getOne()

			return result
		} catch (err) {
			throw new Error(`Error fetching activation device by mac: ${err}`);
		}
	},

	updateAfterActivate: async (deviceId: string, customName: string | null): Promise<Device> => {
		return await dataSource.transaction(async transactionEntityManager => {
			try {
				const device = await transactionEntityManager.findOne(Device, {where: {id: deviceId}})

				if (!device) {
					throw new Error(`Device not found for id ${deviceId}`)
				}

				device.status = DeviceStatus.active

				if (customName) {
					device.custom_name = customName;
				}

				const ipdatedDevice = transactionEntityManager.save(device)

				return ipdatedDevice
			} catch (err) {
				throw new Error(`Error updating device after activation: ${err}`);
			}
		})
	},

	getLockedByOrga: async (orgaId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder("device")
				.where("device.status = :status", {status: "locked"})
				.andWhere("device.organization_id = :orgaId", {orgaId})
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching locked devices by orga: ${err}`);
		}
	}
}

export default deviceService