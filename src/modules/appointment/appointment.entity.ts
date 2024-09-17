import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../Patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';

@Entity('Appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_user_id: number;

  @Column()
  doctor_user_id: number;

  @Column({ type: 'decimal' })
  fees: number;

  @Column({ type: 'varchar' })
  visit_type: string;

  @Column({ type: 'varchar', nullable: true })
  ivr_app_id: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  patient_complaint: string;

  @Column({ type: 'decimal', nullable: true })
  patient_current_weight: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_user_id', referencedColumnName: 'user_id' })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_user_id', referencedColumnName: 'user_id' })
  doctor: Doctor;
}
