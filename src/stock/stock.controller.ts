// src/stock/stock.controller.ts

import { Controller, Post, Body, Put, Param, Delete, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/guards/role/role.guard';

@ApiTags('stocks')
@Controller('stocks')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(Role.ADMIN, Role.STOCK_OWNER)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new stock (Stock Owner)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Stock created successfully.' })
  async createStock(@Body() createStockDto: CreateStockDto) {
    return this.stockService.createStock(createStockDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing stock (Stock Owner or Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock updated successfully.' })
  async updateStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.updateStock(id, updateStockDto);
  }

  @Put(':id/manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update the manager of a stock (Stock Owner or Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock manager updated successfully.' })
  async updateStockManager(@Param('id') id: string, @Body('stockManagerId') stockManagerId: string) {
    return this.stockService.updateStockManager(id, stockManagerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a stock (Stock Owner)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Stock deleted successfully.' })
  async deleteStock(@Param('id') id: string) {
    return this.stockService.deleteStock(id);
  }

  @Get(':stockOwnerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all stocks by stock owner ID (Stock Owner)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stocks fetched successfully.' })
  async getAllStocks(@Param('stockOwnerId') stockOwnerId: string) {
    return this.stockService.getStockById(stockOwnerId);
  }

  @Get(':stockOwnerId/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific stock by ID (Stock Owner or Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock fetched successfully.' })
  async getStockById(@Param('stockOwnerId') stockOwnerId: string, @Param('id') id: string) {
    const stock = await this.stockService.getStockById(id);
    if (stock.stockOwnerId !== stockOwnerId) {
      throw new Error('You are not authorized to view this stock.');
    }
    return stock;
  }
}