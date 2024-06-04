import {Device, DeviceStatus} from "../entities/device";
import dataSource from "../config/db";
import {DeviceData} from "../controllers/deviceController";
import {Mac} from "../entities/mac";

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
			activationCode,
			organizationId,
			model
		} = deviceData

		try {
			const result = await deviceRepository
				.createQueryBuilder('devices')
				.insert()
				.into(Device)
				.values({
					activation_code: activationCode,
					organization: {id: organizationId},
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
				.leftJoinAndSelect('devices.model', 'device_model')
				.leftJoinAndSelect('device_model.type', 'device_type')
				.leftJoinAndSelect('devices.mac', 'mac')
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

	updateAfterActivate: async (deviceId: string, customName: string | null, macId: string): Promise<Device> => {
		return await dataSource.transaction(async transactionEntityManager => {
			try {
				const device = await transactionEntityManager.findOne(Device, {where: {id: deviceId}})
				const mac = await transactionEntityManager.findOne(Mac, {where: {id: macId}});

				if (!device) {
					throw new Error(`Device not found for id ${deviceId}`)
				}
				if (!mac) {
					throw new Error(`MAC not found for id ${macId}`);
				}

				device.status = DeviceStatus.active
				device.mac = mac

				if (customName) {
					device.custom_name = customName;
				}

				const updatedDevice = transactionEntityManager.save(device)

				return updatedDevice
			} catch (err) {
				throw new Error(`Error updating device after activation: ${err}`);
			}
		})
	},

	getLockedByOrga: async (orgaId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder("device")
				.leftJoinAndSelect('device.model', 'model')
				.where("device.status = :status", {status: DeviceStatus.locked})
				.andWhere("device.organization_id = :orgaId", {orgaId})
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching locked devices by orga: ${err}`);
		}
	},

	getSharedDevices: async (orgaId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('device')
				.leftJoinAndSelect('device.model', 'model')
				.where("device.organization_id = :orgaId", {orgaId})
				.andWhere('model.protocol = :protocol', {protocol: "network"})
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching shared devices for orga: ${err}`)
		}
	}
}

export default deviceService