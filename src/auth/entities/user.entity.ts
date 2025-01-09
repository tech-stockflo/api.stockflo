// src/auth/entities/user.entity.ts

import { IsStrongPassword } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column()
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @IsStrongPassword()
  password: string;

  @Column({ default: 'ENABLED' })
  status: 'ENABLED' | 'DISABLED';
}