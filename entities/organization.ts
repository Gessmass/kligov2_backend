import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Computer} from "./computer";
import {User} from "./user";
import {Device} from "./device"
import {Address} from "./address";


@Entity({name: 'organizations'})
export class Organization extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", nullable: false, length: 65})
	name: string

	@Column({type: "character varying", nullable: true, length: 65})
	type: string

	@Column({type: "boolean", nullable: false, default: false})
	network_mode_activated: boolean

	@OneToMany(() => Computer, (computer) => computer.organization)
	computers: Computer[]

	@OneToOne(() => User, (user) => user.organization)
	user: User

	@OneToMany(() => Device, (device) => device.organization)
	devices: Device[]

	@OneToOne(() => Address, address => address.organization)
	@JoinTable()
	address: Address

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}
