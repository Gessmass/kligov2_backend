import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Model} from "./model";

@Entity({name: 'brands'})
export class Brand extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 20, nullable: false})
	name: string

	@OneToMany(() => Model, (model) => model.brand)
	models: Model[]

	@Column({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}