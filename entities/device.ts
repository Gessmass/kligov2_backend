import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import {Characteristic} from "./characteristic";
import {Organization} from "./organization";
import {Model} from "./model";
import {UsersHasDevices} from "./users_has_devices";

export enum DeviceStatus {
	active = "active",
	removed = "removed",
	locked = "locked",
}

export enum MacType {
	public = 0,
	private = 1
}

@Entity({name: "devices"})
export class Device extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 65, nullable: true})
	name: string

	@Column({type: "character varying", length: 65, nullable: true})
	custom_name: string

	@Column({type: "macaddr", nullable: false})
	mac: string

	@Column({type: "enum", enum: MacType, nullable: false})
	mac_type: MacType

	@Column({type: "enum", enum: DeviceStatus, nullable: false})
	status: DeviceStatus

	@Column({type: "character varying", length: 6, nullable: false})
	activation_code: string

	@OneToMany(() => UsersHasDevices, (usersDevices) => usersDevices.device)
	users: UsersHasDevices[]

	@OneToMany(() => Characteristic, (char) => char.device)
	@JoinColumn({name: "characteristic_id"})
	characteristics: Characteristic[]

	@ManyToOne(() => Organization, (orga) => orga.devices)
	@JoinColumn({name: "organization_id"})
	organization: Organization

	@ManyToOne(() => Model, (model) => model.devices)
	@JoinColumn({name: "model_id"})
	model: Model

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}