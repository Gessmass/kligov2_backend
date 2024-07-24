import dataSource from "../config/db";
import {Mac} from "../entities/mac";
import {Device} from "../entities/device";

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

	updateAfterActivate: async (macAddr: string, deviceId: string) => {
		return await dataSource.transaction(async transactionentityManager => {
			try {
				const mac = await transactionentityManager.findOne(Mac, {where: {addr: macAddr}})
				const device = await transactionentityManager.findOne(Device, {where: {id: deviceId}})

				if (!device) {
					throw new Error(`Device not found for id ${deviceId}`)
				}
				if (!mac) {
					throw new Error(`MAC not found for address ${macAddr}`);
				}


				mac!.activated_on = new Date()
				mac!.device = device
				mac!.is_activated = true

				const updatedMac = transactionentityManager.save(mac)

				return updatedMac
			} catch (err) {
				throw new Error(`Error updating device after activation: ${err}`);
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
	}
}
export default macService