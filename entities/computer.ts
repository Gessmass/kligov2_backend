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

enum OperatingSystem {
	darwin = 'Mac',
	win32 = 'Windows',
	linux = 'Linux',
}

@Entity({name: 'computers'})
export class Computer extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", nullable: false, length: 255})
	name: string

	@Column({type: "inet", nullable: false})
	ipv4: IpAddress.Address4

	@Column({type: "boolean", nullable: false, default: false})
	is_master: boolean

	@Column({type: "enum", enum: OperatingSystem, nullable: false})
	os: OperatingSystem

	@Column({type: "character varying", nullable: true, length: 10})
	os_version: string

	@ManyToOne(() => Organization, (organization) => organization.computers)
	@JoinColumn({name: "organization_id"})
	organization: Organization

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date
}


