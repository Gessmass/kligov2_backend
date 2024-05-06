import {DataSource} from 'typeorm'
import {Organization} from "../entities/organization";
import {Address} from "../entities/address";
import {Characteristic} from "../entities/characteristic";
import {Computer} from "../entities/computer";
import {Device} from "../entities/device";
import {Log} from "../entities/log";
import {User} from "../entities/user";
import {UserHasDevice} from "../entities/user_has_device";

export const dataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "postgres",
	password: "1997",
	database: "kligov2",
	synchronize: false,
	logging: ["error", "query"],
	entities: [Organization, Address, Characteristic, Computer, Device, Log, User, UserHasDevice]
})

export default dataSource