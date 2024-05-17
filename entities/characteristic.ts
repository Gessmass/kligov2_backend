import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Device} from "./device";

@Entity({name: 'characteristics'})
export class Characteristic extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: string

	@Column({type: "character varying", length: 65, nullable: false})
	value: string

	@Column({type: "character varying", length: 65, nullable: false})
	type: string

	@ManyToOne(() => Device, (device) => device.characteristics)
	@JoinColumn({name: "device_id"})
	device: Device

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}