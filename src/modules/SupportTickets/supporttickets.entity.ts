import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Roles } from '../roles/roles.entity';

@Entity('SupportTickets')
export class SupportTickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column()
  patient_id: number;

  @ManyToOne(() => Roles, (roles) => roles.supportTickets)
  roles: Roles;
}
