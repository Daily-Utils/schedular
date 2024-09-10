import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Patient } from '../Patient/patient.entity';
import { Timings } from '../timings/timings.entity';
import { SupportTickets } from '../SupportTickets/supporttickets.entity';
import { User } from '../users/schemas/user.entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  roles_name: string;

  @Column('text', { array: true })
  appointment_permission: string[];

  @Column('text', { array: true })
  patient_details_permission: string[];

  @Column('text', { array: true })
  feedback_permission: string[];

  @OneToMany(() => Patient, (patient) => patient.role)
  patients: Patient[];

  @OneToMany(() => Timings, (timings) => timings.roles)
  timings: Timings[];

  @OneToMany(() => SupportTickets, (supportTickets) => supportTickets.roles)
  supportTickets: SupportTickets[];

  @OneToMany(() => User, (user) => user.roles)
  users: User[];
}

