import { Entity, Column, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Patient } from '../Patient/patient.entity';
import { Timings } from '../timings/timings.entity';
import { SupportTickets } from '../SupportTickets/supporttickets.entity';
import { User } from '../users/schemas/user.entity';

@Entity('roles')
export class Roles {
  @PrimaryColumn({ type: 'varchar' })
  roles_name: string;

  @Column('text', { array: true })
  appointment_permission: string[];

  @Column('text', { array: true })
  support_tickets_permissions: string[];

  @Column('text', { array: true })
  feedback_permission: string[];

  @OneToMany(() => User, (user) => user.roleEntity)
  users: User[];
}

