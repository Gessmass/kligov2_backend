import {DataSource} from 'typeorm'
import {Organization} from "../entities/organization";
import {Address} from "../entities/address";
import {Characteristic} from "../entities/characteristic";
import {Computer} from "../entities/computer";
import {Device} from "../entities/device";
import {Log} from "../entities/log";
import {User} from "../entities/user";
import {Model} from "../entities/model";
import {DeviceType} from "../entities/device_types";
import {Brand} from "../entities/brand";
import {Measurement} from "../entities/measurements";
import {UsersHasDevices} from "../entities/users_has_devices";

export const dataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "1997",
	database: "kligov2",
	synchronize: false,
	logging: ["error", "query"],
	entities: [Organization, Address, Characteristic, Computer, Device, Log, User, UsersHasDevices, Model, DeviceType, Brand, Measurement]
})

export default dataSource