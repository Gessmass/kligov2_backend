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
import {UserHasDevice} from "./user_has_device";

export enum DeviceStatus {
	active = "active",
	removed = "removed",
	locked = "locked",
}

export enum ComProtocol {
	ble = "ble",
	wifi = "wifi",
	lan = "lan"
}

export enum MacType {
	public = 0,
	private = 1
}

@Entity({name: "device"})
export class Device extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: string

	@Column({type: "character varying", length: 65, nullable: true})
	name: string

	@Column({type: "character varying", length: 65, nullable: true})
	custom_name: string

	@Column({type: "character varying", length: 65, nullable: false})
	type: string

	@Column({type: "macaddr", nullable: false})
	mac: string

	@Column({type: "enum", enum: MacType, nullable: false})
	mac_type: MacType

	@Column({type: "enum", enum: DeviceStatus, nullable: false})
	status: DeviceStatus

	@Column({type: "enum", enum: ComProtocol, nullable: false})
	protocol: ComProtocol

	@Column({type: "character varying", length: 6, nullable: false})
	activation_code: string

	@OneToMany(() => UserHasDevice, (userHasDevice) => userHasDevice.device)
	userHasDevice: UserHasDevice[]

	@OneToMany(() => Characteristic, (char) => char.device)
	@JoinColumn({name: "characteristic_id"})
	characteristics: Characteristic[]

	@ManyToOne(() => Organization, (orga) => orga.devices)
	@JoinColumn({name: "organization_id"})
	organization: Organization

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}