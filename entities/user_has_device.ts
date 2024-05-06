import {BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Device} from "./device";

@Entity()
export class UserHasDevice extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string

	@ManyToOne(() => User, (user) => user.userHasDevice)
	@JoinColumn({name: 'user_id'}) // Ensure this matches your DB column name
	user: User;

	@ManyToOne(() => Device, (device) => device.userHasDevice)
	@JoinColumn({name: 'device_id'}) // Ensure this matches your DB column name
	device: Device;

	@CreateDateColumn({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
	created_at: Date
}