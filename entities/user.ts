import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import {Organization} from "./organization";
import {UsersHasDevices} from "./users_has_devices";

@Entity({name: 'users'})
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string

	@Column({type: "character varying", nullable: false, length: 255})
	firstname: string

	@Column({type: "character varying", nullable: false, length: 255})
	lastname: string

	@Column({type: "character varying", nullable: true, length: 65})
	type: string

	@Column({type: "character varying", nullable: false, length: 65})
	email: string

	@Column({type: "character varying", nullable: true, length: 255})
	password: string

	@OneToOne(() => Organization, (orga) => orga.user)
	@JoinColumn({name: "organization_id"})
	organization: Organization

	@OneToMany(() => UsersHasDevices, (usersDevices) => usersDevices.user)
	devices: UsersHasDevices[]

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}