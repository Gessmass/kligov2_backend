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
import {Brand} from "./brand";
import {Device} from "./device";
import {Mac} from "./mac";
import {ModelType} from "./model_type";

export enum ComProtocol {
	ble = "ble",
	network = "network"
}

@Entity({name: 'models'})
export class Model extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({type: 'character varying', length: 65, nullable: false})
	name: string;

	@Column({type: "enum", enum: ComProtocol, nullable: false})
	protocol: ComProtocol;

	@Column({type: "character varying", length: 35, nullable: false})
	default_name: string

	@ManyToOne(() => Brand, (brand) => brand.models)
	@JoinColumn({name: "brand_id"})
	brand: Brand;

	@ManyToOne(() => ModelType, type => type.models)
	@JoinColumn({name: 'model_type_id'})
	type: ModelType

	@OneToMany(() => Device, (device) => device.model)
	devices: Device[];

	@OneToMany(() => ModelHasMeasurement, mm => mm.model)
	modelMeasurements: ModelHasMeasurement[];

	@OneToMany(() => Mac, mac => mac.model)
	macs: Mac[]

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}