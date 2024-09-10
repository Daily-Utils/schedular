import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';
import { Chat } from '../Chat/chat.entity';


@Entity('Doctor')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', array: true })
  services: string[];

  @Column({ type: 'text', array: true })
  speciality: string[];

  @Column({ type: 'int' })
  timing_id: number;

  @Column({ type: 'double' })
  default_fee: number;

  @Column({ type: 'time' })
  average_consulting_time: string;

  @Column({ type: 'varchar' })
  facility_name: string;

  @Column({ type: 'varchar' })
  facility_type: string;

  @Column({ type: 'varchar' })
  facility_location: string;

 
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => Chat, (chat) => chat.doctor)
  chat: Chat[];

}
