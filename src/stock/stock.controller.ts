// src/stock/stock.controller.ts

import {  Controller,  Post,  Body,  Put,  Param,  Delete,  Get,  HttpCode,  HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new stock (Stock Manager)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Stock created successfully.' })
  async createStock(@Body() createStockDto: CreateStockDto) {
    return this.stockService.createStock(createStockDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an existing stock (Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock updated successfully.' })
  async updateStock(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.updateStock(id, updateStockDto);
  }

  @Put(':id/manager')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update the manager of a stock (Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock manager updated successfully.' })
  async updateStockManager(@Param('id') id: string, @Body('managerId') managerId: string) {
    return this.stockService.updateStockManager(id, managerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a stock (Stock Manager)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Stock deleted successfully.' })
  async deleteStock(@Param('id') id: string) {
    return this.stockService.deleteStock(id);
  }

  @Get(':managerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all stocks by manager ID (Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stocks fetched successfully.' })
  async getAllStocks(@Param('managerId') managerId: string) {
    return this.stockService.getAllStocks(managerId);
  }

  @Get(':managerId/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific stock by ID (Stock Manager)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Stock fetched successfully.' })
  async getStockById(@Param('managerId') managerId: string, @Param('id') id: string) {
    const stock = await this.stockService.getStockById(id);
    if (stock.managerId !== managerId) {
      throw new Error('You are not authorized to view this stock.');
    }
    return stock;
  }
}
