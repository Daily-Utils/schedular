import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { Chat } from '../Chat/chat.entity';
import { Timings } from '../timings/timings.entity';
import { User } from '../users/schemas/user.entity';

@Entity('Doctor')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', array: true })
  services: string[];

  @Column({ type: 'text', array: true })
  speciality: string[];

  @Column({ type: 'decimal' })
  default_fee: number;

  @Column({ type: 'time' })
  average_consulting_time: string;

  @Column({ type: 'varchar' })
  facility_name: string;

  @Column({ type: 'varchar' })
  facility_type: string;

  @Column({ type: 'varchar' })
  facility_location: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => Chat, (chat) => chat.doctor)
  chat: Chat[];

  @OneToMany(() => Timings, (timings) => timings.doctor)
  timings: Timings[];

  @Column({ nullable: true })
  user_id: number | null;

  @OneToOne(() => User, (user) => user.doctor, { nullable: true })
  @JoinColumn({ name: 'user_id' }) // Foreign key 'id' to link to User
  user: User | null;
}
