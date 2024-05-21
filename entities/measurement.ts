import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {ModelHasMeasurement} from "./model_has_measurement";

@Entity({name: 'measurements'})
export class Measurement extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({type: "character varying", length: 65, nullable: false})
	name: string;

	@Column({type: "character varying", length: 65, nullable: false})
	type: string;

	@Column({type: "character varying", length: 10, nullable: false})
	unit: string;

	@OneToMany(() => ModelHasMeasurement, mm => mm.measurement)
	modelMeasurements: ModelHasMeasurement[];

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}