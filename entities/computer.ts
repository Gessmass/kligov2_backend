import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {Organization} from "./organization";
import * as IpAddress from "ip-address"

enum OsType {
	Mac = "MacOs",
	Linux = "Linux",
	Windows = "Windows"
}

@ObjectType()
@Entity({name: 'computer'})
export class Computer extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column({type: "character varying", nullable: false, length: 255})
	name: string

	@Field()
	@Column({type: "inet", nullable: false})
	ipv4: IpAddress.Address4

	@Field()
	@Column({type: "boolean", nullable: false, default: false})
	is_master: boolean

	@Field(() => OsType)
	@Column({type: "enum", enum: OsType, nullable: false})
	os: OsType

	@Field(() => Organization)
	@ManyToOne(() => Organization, (organization) => organization.computers)
	organization: Organization

	@Field()
	@CreateDateColumn({type: "timestamp with time zone"})
	created_at: Date
}

@InputType()
export class NewComputerInput {
	@Field()
	name: string;

	@Field()
	ipv4: string

	@Field()
	is_master: boolean;

	@Field()
	os: OsType;

	@Field()
	organizationId: number;
}

