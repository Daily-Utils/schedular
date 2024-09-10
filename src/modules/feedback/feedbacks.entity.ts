import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Patient } from '../Patient/patient.entity';

@Entity('Feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  @Column({ type: 'date' })
  time: Date;

  @Column({ type: 'double precision' })
  consulting_feedback: number;

  @Column({ type: 'double precision' })
  clinic_feedback: number;

  @Column({ type: 'double precision' })
  waiting_time: number;

  @Column({ type: 'date' })
  created_at: Date;

  @Column({ type: 'date' })
  updated_at: Date;

 
  @ManyToOne(() => Patient, (patient) => patient.feedbacks)
  patient: Patient;
}

