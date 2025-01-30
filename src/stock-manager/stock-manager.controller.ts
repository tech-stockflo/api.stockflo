// src/stock-manager/stock-manager.controller.dto.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { StockManagerService } from './stock-manager.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateStockManagerDto, UpdateStockManagerDto } from './dto';
import { RoleGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from '@prisma/client';
import { UtilsService } from 'src/utils';

@ApiTags('Stock Managers')
@Controller('stock-managers')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(Role.ADMIN, Role.STOCK_OWNER)
export class StockManagerController {
  constructor(
    private readonly stockManagerService: StockManagerService,
    private readonly utils: UtilsService
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new stock manager' })
  @ApiResponse({
    status: 201,
    description: 'The stock manager has been successfully created.',
  })
  @ApiBody({
    description: 'Data for creating a new stock manager',
    type: CreateStockManagerDto,
  })
  async createStockManager(
    @Body() createStockManagerDto: CreateStockManagerDto,
    @Req() req: Request
  ) {
    const user = await this.utils.getLoggedInUser(req)
    return this.stockManagerService.createStockManager({ ...createStockManagerDto, stockOwnerId: user.id });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing stock manager by ID' })
  @ApiResponse({
    status: 200,
    description: 'The stock manager has been successfully updated.',
  })
  @ApiBody({
    description: 'Data for updating a stock manager',
    type: UpdateStockManagerDto,
  })
  async updateStockManager(
    @Param('id') id: string,
    @Body() updateStockManagerDto: UpdateStockManagerDto,
  ) {
    return this.stockManagerService.updateStockManager(id, updateStockManagerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a stock manager by ID' })
  @ApiResponse({
    status: 204,
    description: 'The stock manager has been successfully deleted.',
  })
  async deleteStockManager(@Param('id') id: string) {
    return this.stockManagerService.deleteStockManager(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch all Stock Managers by a Stock Owner' })
  @ApiResponse({
    status: 200,
    description: 'A list of stock managers.',
    isArray: true,
  })
  async getAllStockManagers(
    @Req() req: Request
  ) {
    const user = await this.utils.getLoggedInUser(req)
    return this.stockManagerService.getAllStockManagers(user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fetch a single stock manager by ID' })
  @ApiResponse({
    status: 200,
    description: 'The details of the stock manager.',
  })
  async getStockManagerById(@Param('id') id: string) {
    return this.stockManagerService.getStockManagerById(id);
  }

  @Put(':id/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable a stock manager by ID' })
  @ApiResponse({
    status: 200,
    description: 'The stock manager has been successfully disabled.',
  })
  async disableStockManager(@Param('id') id: string) {
    return this.stockManagerService.disableStockManager(id);
  }

  @Put(':id/enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable a stock manager by ID' })
  @ApiResponse({
    status: 200,
    description: 'The stock manager has been successfully enabled.',
  })
  async enableStockManager(@Param('id') id: string) {
    return this.stockManagerService.enableStockManager(id);
  }
}
