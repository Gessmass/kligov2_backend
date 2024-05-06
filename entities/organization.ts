import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Computer} from "./computer";
import {User} from "./user";
import {Device} from "./device"


@Entity({name: 'organization'})
export class Organization extends BaseEntity {
	@PrimaryGeneratedColumn()
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

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}
