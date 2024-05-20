import {BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Model} from "./model";
import {Measurement} from "./measurements";

@Entity()
export class ModelsHasMeasures extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@ManyToOne(() => Model, model => model.measurements)
	@JoinColumn({name: 'model_id'})
	model: Model

	@ManyToOne(() => Measurement, mes => mes.models)
	@JoinColumn({name: 'measurement_id'})
	measurement: Measurement

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}