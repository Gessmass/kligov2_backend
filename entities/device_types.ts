import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
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

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}