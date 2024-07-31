import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Organization} from "./organization";
import {Model} from "./model";
import {Mac} from "./mac";

export enum DeviceStatus {
	active = "active",
	removed = "removed",
	locked = "locked",
}


@Entity({name: "devices"})
export class Device extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 65, nullable: true})
	custom_name: string

	@Column({type: "enum", enum: DeviceStatus, nullable: false, default: DeviceStatus.locked})
	status: DeviceStatus

	@Column({type: "character varying", length: 6, nullable: false})
	activation_code: string

	@OneToOne(() => Mac, mac => mac.device)
	@JoinColumn({name: 'mac_id'})
	mac: Mac

	@ManyToOne(() => Organization, (orga) => orga.devices)
	@JoinColumn({name: "organization_id"})
	organization: Organization

	@ManyToOne(() => Model, (model) => model.devices)
	@JoinColumn({name: "model_id"})
	model: Model

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}