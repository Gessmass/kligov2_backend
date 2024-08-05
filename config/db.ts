import {DataSource} from 'typeorm'
import {Organization} from "../entities/organization";
import {Address} from "../entities/address";
import {Characteristic} from "../entities/characteristic";
import {Computer} from "../entities/computer";
import {Device} from "../entities/device";
import {Log} from "../entities/log";
import {User} from "../entities/user";
import {Model} from "../entities/model";
import {Brand} from "../entities/brand";
import {Measurement} from "../entities/measurement";
import {ModelHasMeasurement} from "../entities/model_has_measurement";
import {Mac} from "../entities/mac";
import {ModelType} from "../entities/model_type";
import dotenv from 'dotenv'

dotenv.config()

const {DB_NAME, DB_PORT, DB_HOST, DB_USER, DB_PASSWORD} = process.env

export const dataSource = new DataSource({
	type: "postgres",
	host: DB_HOST!,
	port: parseInt(DB_PORT!),
	username: DB_USER!,
	password: DB_PASSWORD!,
	database: DB_NAME!,
	synchronize: false,
	logging: ["error", "query"],
	entities: [Organization, Address, Characteristic, Computer, Device, Log, User, Model, ModelType, Brand, Measurement, ModelHasMeasurement, Mac]
})

export default dataSource