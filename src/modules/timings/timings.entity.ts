import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity('Timings')
export class Timings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  day: string;

  @Column({ type: 'time' })
  from: string;

  @Column({ type: 'time' })
  to: string;

  @Column()
  doctor_user_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.timings)
  @JoinColumn({ name: 'doctor_user_id' })
  doctor: Doctor;
}
