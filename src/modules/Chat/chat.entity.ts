import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../Patient/patient.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType() // GraphQL object type decorator
@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  chat_id: number;

  @Column()
  patient_user_id: number;

  @Column()
  doctor_user_id: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.chat)
  @JoinColumn({ name: 'patient_user_id', referencedColumnName: 'user_id' })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.chat)
  @JoinColumn({ name: 'doctor_user_id', referencedColumnName: 'user_id' })
  doctor: Doctor;
}
