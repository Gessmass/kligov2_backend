import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Computer} from "./computer";


@ObjectType()
@Entity({name: 'organization'})
export class Organization extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column({type: "character varying", nullable: false, length: 255})
	name: string

	@Field()
	@Column({type: "character varying", nullable: true, length: 255})
	type: string

	@Field(() => [Computer])
	@OneToMany(() => Computer, (ad) => ad.organization)
	computers: Computer[]
	
	@Field()
	@CreateDateColumn({type: "timestamp with time zone"})
	created_at: Date
}


@InputType()
export class NewOrganizationInput implements Partial<Organization> {
	@Field()
	name: string

	@Field()
	type: string
}