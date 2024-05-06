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
import {Address} from "./address";
import {UserHasDevice} from "./user_has_device";

@Entity({name: 'user'})
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
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

	@OneToMany(() => UserHasDevice, (userHasDevice) => userHasDevice.user)
	userHasDevice: UserHasDevice[]

	@OneToMany(() => Address, (add) => add.user)
	addresses: Address[]

	@CreateDateColumn({type: "timestamp with time zone", default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date
}