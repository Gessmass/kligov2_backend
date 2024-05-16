import {BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Device} from "./device";

@Entity({name: 'users_devices'})
export class UsersDevices extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => User, (user) => user.devices)
	@JoinColumn({name: 'user_id'})
	user: User;

	@ManyToOne(() => Device, (device) => device.users)
	@JoinColumn({name: 'device_id'})
	device: Device;

	@CreateDateColumn({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
	created_at: Date
}