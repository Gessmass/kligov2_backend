import dataSource from "../config/db";
import {User} from "../entities/user";
import {UserData} from "../controllers/userController";

const userRepository = dataSource.getRepository(User);

const userService = {

	findByEmail: async (userEmail: string): Promise<User | null> => {
		try {
			const user = await userRepository
				.createQueryBuilder('users')
				.leftJoinAndSelect("users.organization", 'organization')
				.leftJoinAndSelect('organization.computers', 'computers', 'computers.role = :role', {role: 'master'}) // Include role filter in the join condition
				.where('users.email = :userEmail', {userEmail})
				.getOne();

			return user
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