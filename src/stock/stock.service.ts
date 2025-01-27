// src/stock/stock.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) { }

  async createStock(data: CreateStockDto) {
    return this.prisma.stock.create({
      data: {
        ...data,
        stockManagers: {
          connect: { id: data.stockManagerId },
        }
      },
    });
  }

  async updateStock(id: string, data: UpdateStockDto) {
    return this.prisma.stock.update({
      where: { id },
      data,
    });
  }

  async updateStockManager(id: string, managerId: string) {
    return this.prisma.stock.update({
      where: { id },
      data: {
        stockManagers: {
          connect: { id: managerId },
        },
      },
    });
  }

  async deleteStock(id: string) {
    return this.prisma.stock.delete({
      where: { id },
    });
  }

  async getStockById(id: string) {
    return this.prisma.stock.findUnique({
      where: { id },
    });
  }

  async getAllStocks(managerId: string) {
    return this.prisma.stock.findMany({
      where: {
        stockManagers: {
          some: { id: managerId },
        },
      },
    });
  }
}
