// user.entity.ts
import { Roles } from '../../roles/roles.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

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
  phone: string; // Ensure this is of type string

  @Column()
  password: string; // Password will be hashed

  @Column({ type: 'varchar' })
  sex: string;

  @Column({ type: 'int' })
  age: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
