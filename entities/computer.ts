import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Organization} from "./organization";
import * as IpAddress from "ip-address"

enum OperatingSystem {
	darwin = 'Mac',
	win32 = 'Windows',
	linux = 'Linux',
}

@Entity({name: 'computers'})
export class Computer extends BaseEntity {
	@PrimaryGeneratedColumn()
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

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}


