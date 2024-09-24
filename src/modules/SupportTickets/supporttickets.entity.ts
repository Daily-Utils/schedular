import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../Patient/patient.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('SupportTickets')
export class SupportTickets {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar' })
  message: string;

  @Field()
  @Column({ type: 'varchar' })
  status: string;

  @Field()
  @Column()
  patient_user_id: number;

  @ManyToOne(() => Patient, (patient) => patient.supportTickets)
  @JoinColumn({ name: 'patient_user_id', referencedColumnName: 'user_id' })
  patient: Patient;
}
