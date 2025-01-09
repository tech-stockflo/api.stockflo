// src/user-management/user-management.controller.ts

import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from '@prisma/client';

@ApiTags('User management')
@Controller('user-management')
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}
  
  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Put("disable-account/:userId")
  @ApiOperation({
    summary: 'Disable user account by admin',
    description: 'This endpoint disables user acount by admin.',
  })
  async disableAcount(@Param('userId') userId: string) {
    return this.userManagementService.disableAccount(userId)
  }

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Put("enable-account/:userId")
  @ApiOperation({
    summary: 'Enable user account by admin',
    description: 'This endpoint enables user acount by admin.',
  })
  async enableAccount(@Param('userId') userId: string){
    return this.userManagementService.enableAccount(userId)
  }
}