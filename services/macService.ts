import dataSource from "../config/db";
import {Mac} from "../entities/mac";
import {Device, DeviceStatus} from "../entities/device";
import {User} from "../entities/user";
import {EntityManager, IsNull} from "typeorm";

const macRepository = dataSource.getRepository(Mac)

const macService = {

	getOneLocked: async (macAddr: string) => {
		try {
			const result = await macRepository
				.createQueryBuilder('mac')
				.leftJoinAndSelect('mac.model', 'model')
				.where('mac.addr = :macAddr', {macAddr})
				.andWhere('mac.is_activated = :status', {status: false})
				.getOne()

			return result
		} catch (err) {
			console.error(err)
			throw new Error(`Error fetching locked mac address : ${err}`);
		}
	},

	updateAfterActivate: async (macAddr: string, deviceId: string, userId: string) => {
		return await dataSource.transaction(async (transactionEntityManager: EntityManager) => {
			try {
				const mac = await transactionEntityManager.findOne(Mac, {where: {addr: macAddr}})
				const device = await transactionEntityManager.findOne(Device, {where: {id: deviceId}})
				const owner = await transactionEntityManager.findOne(User, {where: {id: userId}})

				if (!device) {
					throw new Error(`Device not found for id ${deviceId}`)
				}
				if (!mac) {
					throw new Error(`MAC not found for address ${macAddr}`);
				}
				if (!owner) {
					throw new Error(`User not found for address ${userId}`);
				}


				mac.activated_on = new Date()
				mac.device = device
				mac.is_activated = true
				mac.user = owner

				const updatedMac = transactionEntityManager.save(mac)

				return updatedMac
			} catch (err) {
				throw new Error(`Error updating device after activation: ${err}`);
			}
		})
	},

	getAllLockedByDeviceSlot: async (orgaId: string) => {
		return await dataSource.transaction(async transactionEntityManager => {
			try {
				const modelsIdsSlotOpenResult: any[] = await transactionEntityManager
					.getRepository(Device)
					.createQueryBuilder('device')
					.leftJoinAndSelect('device.model', 'model')
					.select(['model.id'])
					.where('device.organization = :orgaId', {orgaId})
					.andWhere('device.status = :deviceStatus', {deviceStatus: DeviceStatus.locked})
					.groupBy('model.id')
					.getRawMany()

				const modelsIdsSlotOpen = modelsIdsSlotOpenResult.map(result => result.model_id)

				const lockedMacsByModels: Mac[] = await transactionEntityManager
					.getRepository(Mac)
					.createQueryBuilder('mac')
					.leftJoinAndSelect('mac.model', 'model')
					.leftJoinAndSelect('model.brand', 'brand')
					.leftJoinAndSelect('model.type', 'type')
					.where('mac.model_id IN (:...ids)', {ids: modelsIdsSlotOpen})
					.andWhere('mac.is_activated = :macStatus', {macStatus: false})
					.getMany()

				return lockedMacsByModels
			} catch (err) {
				throw new Error(`Error fetching macs by models and organization : ${err}`);
			}
		})
	},

	getAllLocked: async () => {
		try {
			const result = await macRepository
				.createQueryBuilder('mac')
				.leftJoinAndSelect('mac.model', 'model')
				.where('mac.is_activated = :status', {status: false})
				.getMany()

			return result
		} catch (err) {
			console.error(err)
			throw new Error(`Error fetching all locked mac addresses : ${err}`);
		}
	},

	addOne: async (macData: any) => {
		const {macAddress, model, macType} = macData

		try {
			const result = await macRepository
				.createQueryBuilder('mac')
				.insert()
				.into(Mac)
				.values({
					addr: macAddress,
					type: macType,
					model
				})
				.execute()

			const newMacId = result.identifiers[0].id

			const newMac = await macRepository.findOneBy({id: newMacId})

			return newMac

		} catch (err) {
			console.error(err)
			throw new Error(`Error creating one mac addresse : ${err}`);
		}
	},

	setOwner: async (deviceId: string, userId: string) => {
		return await dataSource.transaction(async (transactionEntityManager: EntityManager) => {
			try {
				const owner = await transactionEntityManager.findOne(User, {where: {id: userId}});
				if (!owner) {
					throw new Error(`Cannot find owner for id ${userId}`);
				}

				const device = await transactionEntityManager.findOne(Device, {where: {id: deviceId}});
				if (!device) {
					throw new Error(`Cannot find device for id ${deviceId}`);
				}

				const mac = await transactionEntityManager.findOne(Mac, {
					where: {
						user: IsNull(),
						device: {id: deviceId}
					}
				});
				if (!mac) {
					throw new Error(`Cannot find Mac address`);
				}

				mac.user = owner;

				await transactionEntityManager.save(mac);

				return true;
			} catch (err) {
				console.error(err);
				throw new Error(`Error setting new owner for device ${deviceId}: ${err}`);
			}
		});
	},

	removeOwner: async (deviceId: string) => {
		try {
			const mac = await macRepository
				.createQueryBuilder('mac')
				.leftJoin('mac.device', 'device')
				.update(Mac)
				.set({user: null})
				.where('device.id = :deviceId', {deviceId})
				.execute()

			return true
		} catch (err) {
			console.error(err);
			throw new Error(`Error setting new owner for device ${deviceId}: ${err}`);
		}
	}
}
export default macService