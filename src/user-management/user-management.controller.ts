// src/user-management/user-management.controller.ts

import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserManagementService } from './user-management.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from '@prisma/client';
import { UtilsService } from 'src/utils/utils.service';

@ApiTags('User management')
@Controller('user-management')
@ApiBearerAuth()
export class UserManagementController {
  constructor(
    private readonly userManagementService: UserManagementService,
    private readonly utils: UtilsService,
  ) {}

  @Roles(Role.ADMIN, Role.STOCK_MANAGER, Role.STOCK_OWNER)
  @UseGuards(RoleGuard)
  @Get('user')
  @ApiOperation({
    summary: 'Get user',
    description: 'This endpoint fetches the user.',
  })
  async getUser(@Req() req: Request){
    const accessToken = req.cookies['ACCESS_TOKEN'] || req.headers['authorization'].split(' ')[1]
    const decodedToken = await this.utils.decodeAccessToken(accessToken)
    return this.userManagementService.getUser(decodedToken.id)
  }
  
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