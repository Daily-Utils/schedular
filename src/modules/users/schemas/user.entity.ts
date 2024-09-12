import { Doctor } from '../../doctor/doctor.entity';
import { Roles } from '../../roles/roles.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Patient } from '../../Patient/patient.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  role: string;

  @ManyToOne(() => Roles, (roles) => roles.users)
  @JoinColumn({ name: 'role', referencedColumnName: 'roles_name' })
  roleEntity: Roles;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'varchar' })
  sex: string;

  @Column({ type: 'int' })
  age: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  doctor_id: number | null;

  @Column({ nullable: true })
  patient_id: number | null;

  @OneToOne(() => Doctor, (doctor) => doctor.user, { nullable: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor | null;

  @OneToOne(() => Patient, (patient) => patient.user, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient | null;
}
