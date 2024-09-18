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
import { Feedback } from '../feedback/feedbacks.entity';

@Entity('Doctor')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', array: true })
  services: string[];

  @Column({ type: 'text', array: true })
  speciality: string[];

  @Column({ type: 'decimal' })
  experience: number;

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

  @OneToMany(() => Appointment, (appointment) => appointment.doctor, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  appointments: Appointment[];

  @OneToMany(() => Chat, (chat) => chat.doctor, {
    cascade: true,
  })
  chat: Chat[];

  @OneToMany(() => Timings, (timings) => timings.doctor, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  timings: Timings[];

  @OneToMany(() => Feedback, (feedback) => feedback.doctor, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  feedbacks: Feedback[];

  @Column({ nullable: true })
  user_id: number | null;

  @OneToOne(() => User, (user) => user.doctor, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) // Foreign key 'id' to link to User
  user: User | null;
}