import {
	BaseEntity,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {User} from "./user";
import {Device} from "./device";

@Entity({name: 'users_has_devices'})
export class UsersHasDevices extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@ManyToOne(() => User, (user) => user.devices)
	@JoinColumn({name: 'user_id'})
	user: User;

	@ManyToOne(() => Device, (device) => device.users)
	@JoinColumn({name: 'device_id'})
	device: Device;

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}