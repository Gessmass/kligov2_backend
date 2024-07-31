import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import {Model} from "./model";
import {Device} from "./device";
import {User} from "./user";

export enum MacType {
	public = 0,
	private = 1
}

@Entity({name: 'macs'})
export class Mac extends BaseEntity {

	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({type: "macaddr", nullable: false})
	addr: string

	@Column({type: 'boolean', nullable: false, default: false})
	is_activated: boolean

	@Column({type: 'timestamp with time zone', nullable: true})
	activated_on: Date

	@Column({type: "enum", enum: MacType, nullable: false})
	type: MacType

	@ManyToOne(() => Model, model => model.macs)
	@JoinColumn({name: 'model_id'})
	model: Model

	@OneToOne(() => Device, device => device.mac)
	@JoinColumn({name: 'device_id'})
	device: Device | null

	@ManyToOne(() => User, user => user.macs)
	@JoinColumn({name: 'user_id'})
	user: User | null

	@CreateDateColumn({type: "timestamp with time zone"})
	created_at: Date
}