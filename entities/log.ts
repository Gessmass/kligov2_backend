import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {User} from "./user";
import {Computer} from "./computer";


@Entity({name: 'logs'})
export class Log {
	@PrimaryGeneratedColumn("uuid")
	id: number;

	@ManyToOne(() => User)
	@JoinColumn({name: "user_id"})
	user: User;

	@Column({type: 'character varying', nullable: false})
	message: string;

	@ManyToOne(() => Computer)
	@JoinColumn({name: "computer_id"})
	computer: Computer;

	@UpdateDateColumn({type: "timestamp with time zone", name: "updated_at", nullable: false})
	updated_at: Date;

	@CreateDateColumn({type: "timestamp with time zone", name: "created_at", nullable: false})
	created_at: Date

}
