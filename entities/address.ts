import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Organization} from "./organization";

@Entity({name: 'addresses'})
export class Address extends BaseEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", length: 255, nullable: false})
	address: string

	@Column({type: "character varying", length: 10, nullable: false})
	zipcode: string

	@Column({type: "character varying", length: 65, nullable: false})
	country: string

	@Column({type: "character varying", length: 65, nullable: false})
	city: string

	@Column({type: "character varying", length: 255, nullable: true})
	additional_information: string

	@Column({type: "character varying", length: 65, nullable: true})
	address_supplements: string

	@OneToOne(() => Organization, orga => orga.address)
	organization: Organization

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: string
}