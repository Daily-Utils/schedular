import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';
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

  @ManyToOne(() => Doctor, (doctor) => doctor.timings)
  doctor: Doctor;
}
