import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../Patient/patient.entity';

@Entity('SupportTickets')
export class SupportTickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column()
  patient_user_id: number;

  @ManyToOne(() => Patient, (patient) => patient.supportTickets)
  @JoinColumn({ name: 'patient_user_id' })
  patient: Patient;
}
