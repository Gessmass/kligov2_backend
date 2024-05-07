import dataSource from "../config/db";
import {User} from "../entities/user";

const userService = {
	findByEmail: async (userEmail: string): Promise<User> => {
		try {
			const user = await dataSource.getRepository(User)
				.createQueryBuilder('user')
				.where('user.email = :userEmail', {userEmail})
				.getMany()
			return user[0]
		} catch (err) {
			throw new Error(`No user registered with email ${err}`)
		}
	}
}

export default userService