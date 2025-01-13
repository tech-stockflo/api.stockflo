// src/stock-manager/stock-manager.service.dto.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockManagerDto, UpdateStockManagerDto } from './dto';

@Injectable()
export class StockManagerService {
  constructor(private readonly prisma: PrismaService) { }

  async createStockManager(createStockManagerDto: CreateStockManagerDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: createStockManagerDto.email } });
    if (existingUser) {
      throw new NotFoundException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        ...createStockManagerDto,
        role: 'STOCK_MANAGER',
      },
    });
  }

  async updateStockManager(id: string, updateStockManagerDto: UpdateStockManagerDto) {
    const stockManager = await this.prisma.user.findUnique({ where: { id } });
    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: updateStockManagerDto.fullName,
        status: updateStockManagerDto.status
      },
    });
  }

  async deleteStockManager(id: string) {
    const stockManager = await this.prisma.user.findUnique({ where: { id } });
    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    return this.prisma.user.delete({ where: { id } });
  }

  async getAllStockManagers(stockOwnerId: string) {
    return this.prisma.user.findMany({
      where: {
        role: 'STOCK_MANAGER',
        stockOwnerId
      },
    });
  }

  async getStockManagerById(id: string) {
    const stockManager = await this.prisma.user.findUnique({ where: { id } });
    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    return stockManager;
  }
}
