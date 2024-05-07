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

enum deviceStatus {
	active = "active",
	removed = "removed",
	locked = "locked",
}

enum comProtocol {
	ble = "ble",
	wifi = "wifi",
	lan = "lan"
}

enum macType {
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

	@Column({type: "enum", enum: macType, nullable: false})
	mac_type: macType

	@Column({type: "enum", enum: deviceStatus, nullable: false})
	status: deviceStatus

	@Column({type: "enum", enum: comProtocol, nullable: false})
	protocol: comProtocol

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