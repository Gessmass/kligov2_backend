import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "./user";
import {Computer} from "./computer";


@Entity({name: 'logs'})
export class Log {
	@PrimaryGeneratedColumn("uuid")
	id: number;

	@ManyToOne(() => User)
	@JoinColumn({name: "user_id"})
	user: User;

	@ManyToOne(() => Computer)
	@JoinColumn({name: "computer_id"})
	computer: Computer;

	@Column({type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP'})
	created_at: Date;

	@Column({type: 'character varying'})
	message: string;
}
