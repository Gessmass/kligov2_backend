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
import {UsersHasDevices} from "../entities/users_has_devices";
import {Measurement} from "../entities/measurement";
import {ModelHasMeasurement} from "../entities/model_has_measurement";
import {Mac} from "../entities/mac";
import {ModelType} from "../entities/model_type";

export const dataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "1997",
	database: "kligov2",
	synchronize: false,
	logging: ["error", "query"],
	entities: [Organization, Address, Characteristic, Computer, Device, Log, User, UsersHasDevices, Model, ModelType, Brand, Measurement, ModelHasMeasurement, Mac]
})

export default dataSource