// src/stock-manager/stock-manager.controller.dto.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { StockManagerService } from './stock-manager.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateStockManagerDto, UpdateStockManagerDto } from './dto';

@ApiTags('Stock Managers')
@Controller('stock-managers')
export class StockManagerController {
  constructor(private readonly stockManagerService: StockManagerService) {}

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
  ) {
    return this.stockManagerService.createStockManager(createStockManagerDto);
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
  @ApiOperation({ summary: 'Fetch all stock managers for a stock owner' })
  @ApiResponse({
    status: 200,
    description: 'A list of stock managers.',
    isArray: true,
  })
  @ApiQuery({
    name: 'stockOwnerId',
    required: true,
    description: 'The ID of the stock owner to fetch stock managers for',
  })
  async getAllStockManagers(@Query('stockOwnerId') stockOwnerId: string) {
    return this.stockManagerService.getAllStockManagers(stockOwnerId);
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
}
