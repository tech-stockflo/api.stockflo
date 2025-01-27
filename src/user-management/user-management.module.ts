// src/user-management/user-management.module.ts

import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { AuthModule } from 'src/auth';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule],
  controllers: [UserManagementController],
  providers: [UserManagementService, JwtService],
})
export class UserManagementModule {}
