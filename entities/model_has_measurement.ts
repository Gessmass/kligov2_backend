import {
	BaseEntity,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {Model} from './model';
import {Measurement} from './measurement';

@Entity({name: 'model_has_measurements'}) // or models_has_measurements if you prefer
export class ModelHasMeasurement extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Model, model => model.modelMeasurements)
	@JoinColumn({name: 'model_id'})
	model: Model;

	@ManyToOne(() => Measurement, measurement => measurement.modelMeasurements)
	@JoinColumn({name: 'measurement_id'})
	measurement: Measurement;

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date;
}
