import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Roles } from '../roles/roles.entity';

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

  @ManyToOne(() => Roles, (roles) => roles.timings)
  roles: Roles;
}
