import dataSource from "../config/db";
import {User} from "../entities/user";
import {UserData} from "../controllers/userController";
import {JwtPayload} from "jsonwebtoken";

const userRepository = dataSource.getRepository(User);

const userService = {
	findOneById: async (id: JwtPayload | string): Promise<User | null> => {
		try {
			const result = await userRepository
				.createQueryBuilder('user')
				.where('user.id = :id', {id})
				.getOne()

			return result
		} catch (err) {
			throw new Error(`No user registered with id ${id} : ${err}`)
		}
	},

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
		const {firstname, lastname, type, email, password, organizationId} = userData;

		try {
			const existingUser = await userRepository.findOneBy({email});
			if (existingUser) {
				throw new Error('User with the provided email already exists.');
			}

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
			if (err === '23505') {
				throw new Error('A user with the same email already exists.');
			}
			throw new Error(`Error creating new user: ${err}`);
		}
	}
}

export default userService