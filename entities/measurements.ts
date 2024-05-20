import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Model} from "./model";

@Entity({name: 'measurements'})
export class Measurement extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 65, nullable: false})
	name: string

	@Column({type: "character varying", length: 65, nullable: false})
	type: string

	@Column({type: "character varying", length: 10, nullable: false})
	unit: string

	@ManyToMany(() => Model, model => model.measurements)
	models: Model[]

	@Column({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}