import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Model} from "./model";
import {Measurement} from "./measurement";

@Entity({name: 'characteristics'})
export class Characteristic extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 65, nullable: false})
	value: string

	@OneToOne(() => Model)
	@JoinColumn({name: "model_id"})
	model: Model

	@OneToOne(() => Measurement)
	@JoinColumn({name: "measurement_id"})
	measurement: Measurement

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}