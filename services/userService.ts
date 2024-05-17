import dataSource from "../config/db";
import {User} from "../entities/user";
import {UserData} from "../controllers/userController";

const userRepository = dataSource.getRepository(User);

const userService = {

	findByEmail: async (userEmail: string): Promise<User> => {
		try {
			const user = await userRepository
				.createQueryBuilder('users')
				.where('users.email = :userEmail', {userEmail})
				.leftJoinAndSelect("users.organization", 'organization')
				.getMany()
			return user[0]
		} catch (err) {
			throw new Error(`No user registered with email ${err}`)
		}
	},

	addOne: async (userData: UserData): Promise<User | null> => {
		const {firstname, lastname, type, email, password, organizationId} = userData

		try {
			const result = await userRepository
				.createQueryBuilder('users')
				.insert()
				.into(User)
				.values({
					firstname,
					lastname,
					type,
					email,
					password,
					organization: {id: organizationId}
				})
				.execute()

			const userId = result.identifiers[0].id;

			const user = await userRepository.findOneBy({id: userId});

			return user
		} catch (err) {
			throw new Error(`Error creating new user : ${err}`)
		}
	}
}

export default userService