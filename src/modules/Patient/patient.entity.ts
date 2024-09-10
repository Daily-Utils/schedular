import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Roles } from '../roles/roles.entity';
import { Feedback } from '../feedback/feedbacks.entity';
import { Appointment } from '../appointment/appointment.entity';
import { Chat } from '../Chat/chat.entity';
import { SupportTickets } from '../SupportTickets/supporttickets.entity';

@Entity('Patient')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true })
  family_member: number[];

  @Column('text', { array: true })
  relation: string[];

  @Column('text', { array: true })
  health_issue: string[];

  @OneToMany(() => Feedback, (feedback) => feedback.patient)
  feedbacks: Feedback[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Chat, (chat) => chat.patient)
  chat: Chat[];

  @OneToMany(() => SupportTickets, (supportTickets) => supportTickets.patient)
  supportTickets: SupportTickets[];
}
