import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../Patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';


@Entity('Feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_user_id: number;

  @Column()
  doctor_user_id: number;

  @Column({ type: 'decimal' })
  consulting_feedback: number;

  @Column({ type: 'decimal' })
  clinic_or_hospital_feedback: number;

  @Column({ type: 'decimal' })
  waiting_time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.feedbacks)
  @JoinColumn({ name: 'patient_user_id', referencedColumnName: 'user_id' })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.feedbacks)
  @JoinColumn({ name: 'doctor_user_id', referencedColumnName: 'user_id' })
  doctor: Doctor;
}
