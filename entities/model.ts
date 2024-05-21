import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {ModelHasMeasurement} from "./model_has_measurement";
import {DeviceType} from "./device_types";
import {Brand} from "./brand";
import {Device} from "./device";

enum ComProtocol {
	ble = "ble",
	wifi = "wifi",
	lan = "lan"
}

@Entity({name: 'models'})
export class Model extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({type: 'character varying', length: 65, nullable: false})
	name: string;

	@Column({type: "enum", enum: ComProtocol, nullable: false})
	protocol: ComProtocol;

	@ManyToOne(() => Brand, (brand) => brand.models)
	@JoinColumn({name: "brand_id"})
	brand: Brand;

	@OneToMany(() => Device, (device) => device.model)
	devices: Device[];

	@OneToMany(() => ModelHasMeasurement, mm => mm.model)
	modelMeasurements: ModelHasMeasurement[];

	@OneToMany(() => DeviceType, type => type.models)
	type: DeviceType[];

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}