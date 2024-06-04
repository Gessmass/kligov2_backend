import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Model} from "./model";

@Entity({name: 'model_types'})
export class ModelType extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 65, nullable: false})
	name: string

	@Column({type: "character varying", length: 65, nullable: false})
	value: string

	@OneToMany(() => Model, model => model.type)
	models: Model[]

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}