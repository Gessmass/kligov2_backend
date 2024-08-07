import {Device, DeviceStatus} from "../entities/device";
import dataSource from "../config/db";
import {DeviceData} from "../controllers/deviceController";
import {Mac} from "../entities/mac";
import {ComProtocol} from "../entities/model";

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

	getOne: async (deviceId: string): Promise<Device | null> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('device')
				.where('device.id = :deviceId', {deviceId})
				.getOne()

			return result
		} catch (err) {
			throw new Error(`Error fetching one device by ID : ${err}`)
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

	getAllByUserIdWithChars: async (userId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('devices')
				.leftJoinAndSelect('devices.model', 'device_model')
				.leftJoinAndSelect('device_model.type', 'device_type')
				.leftJoinAndSelect('devices.mac', 'mac')
				.where('mac.user_id = :userId', {userId})
				.andWhere('devices.status = :status', {status: "active"})
				.getMany();

			return result

		} catch (err) {
			throw new Error(`Error fetching user devices with their characteristics: ${err}`);
		}
	},

	updateAfterActivate: async (deviceId: string, customName: string | null, macId: string | null): Promise<Device> => {
		return await dataSource.transaction(async transactionEntityManager => {
			try {
				const device = await transactionEntityManager.findOne(Device, {where: {id: deviceId}});
				if (!device) {
					throw new Error(`Device not found for id ${deviceId}`);
				}

				if (macId) {
					const mac = await transactionEntityManager.findOne(Mac, {where: {id: macId}});
					if (!mac) {
						throw new Error(`MAC not found for id ${macId}`);
					}
					device.mac = mac;
				}

				device.status = DeviceStatus.active;

				if (customName) {
					device.custom_name = customName;
				}

				const updatedDevice = await transactionEntityManager.save(device);
				return updatedDevice;
			} catch (err) {
				throw new Error(`Error updating device after activation: ${err}`);
			}
		});
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

	getNetworkLockedByOrga: async (orgaId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder("device")
				.select(['device.id', 'device.status'])
				.leftJoinAndSelect('device.model', 'model')
				.leftJoinAndSelect('model.brand', 'brand')
				.leftJoinAndSelect('model.type', 'type')
				.where("device.status = :status", {status: DeviceStatus.locked})
				.andWhere("model.protocol = :protocol", {protocol: ComProtocol.network})
				.andWhere("device.organization_id = :orgaId", {orgaId})
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching locked devices by orga: ${err}`);
		}
	},

	getNetworkDevicesByOrgaId: async (orgaId: string): Promise<Device[]> => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('device')
				.leftJoinAndSelect('device.model', 'model')
				.leftJoinAndSelect('model.type', 'type')
				.where("device.organization_id = :orgaId", {orgaId})
				.andWhere("device.status = :status", {status: DeviceStatus.active})
				.andWhere('model.protocol = :protocol', {protocol: "network"})
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching shared devices for orga: ${err}`)
		}
	},

	rename: async (deviceId: string, name: string) => {
		try {
			const result = await deviceRepository
				.createQueryBuilder()
				.update(Device)
				.set({custom_name: name})
				.where('id = :deviceId', {deviceId})
				.execute()

			return result
		} catch (err) {
			throw new Error(`Error trying to rename device ${deviceId} : ${err}`)
		}
	},

	getUnusedByOrga: async (orgaId: string) => {
		try {
			const result = await deviceRepository
				.createQueryBuilder('device')
				.leftJoin('device.mac', 'mac')
				.leftJoinAndSelect('device.model', 'model')
				.leftJoinAndSelect('model.brand', 'brand')
				.where('device.organization = :orgaId', {orgaId})
				.andWhere('device.status = :deviceStatus', {deviceStatus: DeviceStatus.active})
				.andWhere('device.mac IS NOT NULL')
				.andWhere('mac.user IS NULL')
				.getMany()

			return result
		} catch (err) {
			throw new Error(`Error fetching unused BLE devices for organization ${orgaId} : ${err}`)
		}
	}
}

export default deviceService