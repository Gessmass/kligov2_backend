import {Device} from "../entities/device";
import dataSource from "../config/db";
import {DeviceData} from "../controllers/deviceController";
import {UpdateResult} from "typeorm";

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
				.createQueryBuilder('devices')
				.insert()
				.into(Device)
				.values({
					type,
					status,
					mac,
					model,
					protocol,
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
				.createQueryBuilder('devices')
				.leftJoinAndSelect('devices.users', 'users_devices')
				.where('users_devices.user_id = :userId', {userId})
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

	updateAfterActivate: async (deviceId: string, customName: string | null): Promise<UpdateResult> => {
		try {
			const queryBuilder = deviceRepository.createQueryBuilder().update('devices').set({status: 'active'});

			if (customName) {
				queryBuilder.set({custom_name: customName});
			}

			queryBuilder.where('devices.id = :deviceId', {deviceId});

			const result = await queryBuilder.execute();
			return result
		} catch (err) {
			throw new Error(`Error updating device after activation: ${err}`);
		}
	}
}

export default deviceService