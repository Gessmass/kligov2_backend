import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

@Entity()
export class Address extends BaseEntity {

	@PrimaryGeneratedColumn()
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

	@ManyToOne(() => User, (user) => user.addresses)
	@JoinColumn({name: "user_id"})
	user: User

	@CreateDateColumn({type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP"})
	created_at: string
}