import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Organization} from "./organization";
import * as IpAddress from "ip-address"


export enum roleOptions {
	slave = 'slave',
	master = 'master'
}

@Entity({name: 'computers'})
export class Computer extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "inet", nullable: true})
	ip: IpAddress.Address4 | IpAddress.Address6

	@Column({type: "enum", enum: roleOptions, nullable: false, default: roleOptions.slave})
	role: roleOptions

	@Column({type: "character varying", nullable: false, length: 255})
	home_dir: string

	@Column({type: "character varying", nullable: false, length: 65})
	hostname: string

	@Column({type: "character varying", nullable: false, length: 10})
	platform: string

	@Column({type: "character varying", nullable: false, length: 10})
	arch: string

	@Column({type: "character varying", nullable: false, length: 10})
	os_version: string

	@Column({type: "character varying", nullable: false, array: true})
	cpus: string[]

	@Column({type: "character varying", nullable: false, length: 255})
	composed_id: string

	@Column({type: "integer", nullable: false})
	parallelism: number

	@Column({type: "numeric", nullable: false})
	total_memory: number

	@ManyToOne(() => Organization, (organization) => organization.computers)
	@JoinColumn({name: "organization_id"})
	organization: Organization

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}


