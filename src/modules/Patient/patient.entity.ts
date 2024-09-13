import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Feedback } from '../feedback/feedbacks.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Chat } from '../Chat/chat.entity';
import { SupportTickets } from '../SupportTickets/supporttickets.entity';
import { User } from '../users/schemas/user.entity';

@Entity('Patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number; // This id is the primary key and also a foreign key to the 'User' table.

  @Column('int', { array: true })
  family_member: number[];

  @Column()
  blood_group: string;

  @Column()
  weight: number;

  @Column('text', { array: true })
  relation: string[];

  @Column('text', { array: true })
  health_issues: string[];

  @OneToMany(() => Feedback, (feedback) => feedback.patient, {
    cascade: true,
  })
  feedbacks: Feedback[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    cascade: true,
  })
  appointments: Appointment[];

  @OneToMany(() => Chat, (chat) => chat.patient, {
    cascade: true,
  })
  chat: Chat[];

  @OneToMany(() => SupportTickets, (supportTickets) => supportTickets.patient, {
    cascade: true,
  })
  supportTickets: SupportTickets[];

  @Column({ nullable: true })
  user_id: number | null;

  @OneToOne(() => User, (user) => user.patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;
}
