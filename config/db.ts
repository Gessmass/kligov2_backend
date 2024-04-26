import {DataSource} from 'typeorm'
import {Organization} from "../entities/organization";

const {DB_HOST, DB_USER, DB_NAME, DB_PORT, DB_PASSWORD} = process.env

export const dataSource = new DataSource({
	type: "postgres",
	host: DB_HOST,
	port: Number(DB_PORT),
	username: DB_USER,
	password: String(DB_PASSWORD),
	database: DB_NAME,
	synchronize: false,
	logging: ["error", "query"],
	entities: [Organization]
})

export default dataSource