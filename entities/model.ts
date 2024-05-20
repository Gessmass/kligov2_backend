import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import {Brand} from "./brand";
import {Device} from "./device";
import {Measurement} from "./measurements";
import {DeviceType} from "./device_types";

export enum ComProtocol {
	ble = "ble",
	wifi = "wifi",
	lan = "lan"
}

@Entity({name: 'models'})
export class Model extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: 'character varying', length: 65, nullable: false})
	name: string

	@Column({type: "enum", enum: ComProtocol, nullable: false})
	protocol: ComProtocol

	@ManyToOne(() => Brand, (brand) => brand.models)
	@JoinColumn({name: "brand_id"})
	brand: Brand

	@OneToMany(() => Device, (device) => device.model)
	devices: Device[]

	@ManyToMany(() => Measurement, measurement => measurement.models)
	@JoinTable({
		name: "models_has_measurements",
		joinColumn: {
			name: "model_id",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "measurement_id",
			referencedColumnName: "id"
		}
	})
	measurements: Measurement[]

	@OneToMany(() => DeviceType, type => type.models)
	type: DeviceType

	@Column({type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}