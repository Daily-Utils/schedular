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
import { ObjectType } from '@nestjs/graphql';


@Entity('Feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  
  @Column({ type: 'decimal' })
  consulting_feedback: number;

  @Column({ type: 'decimal' })
  clinic_feedback: number;

  @Column({ type: 'decimal' })
  waiting_time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.feedbacks)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
