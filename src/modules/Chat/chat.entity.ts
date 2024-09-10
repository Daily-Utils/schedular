import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../Patient/patient.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patient_id: number;

  @Column()
  doctor_id: number;


  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.chat)
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.chat)
  patient: Patient;
}
