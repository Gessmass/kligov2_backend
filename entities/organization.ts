import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import {Computer} from "./computer";
import {User} from "./user";
import {Device} from "./device"
import {Address} from "./address";


@Entity({name: 'organizations'})
export class Organization extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", nullable: false, length: 255})
	name: string

	@Column({type: "character varying", nullable: true, length: 255})
	type: string

	@OneToMany(() => Computer, (computer) => computer.organization)
	computers: Computer[]

	@OneToOne(() => User, (user) => user.organization)
	user: User

	@OneToMany(() => Device, (device) => device.organization)
	devices: Device[]

	@OneToOne(() => Address, address => address.organization)
	@JoinTable()
	address: Address

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}
