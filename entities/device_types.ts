import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Model} from "./model";

@Entity({name: 'device_types'})
export class DeviceType extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 65, nullable: false})
	name: string

	@Column({type: "character varying", length: 65, nullable: false})
	value: string

	@ManyToOne(() => Model, model => model.type)
	@JoinColumn({name: 'model_id'})
	models: Model[]

	@Column({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}