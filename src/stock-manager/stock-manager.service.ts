// src/stock-manager/stock-manager.service.dto.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStockManagerDto, UpdateStockManagerDto } from './dto';
import { UtilsService } from 'src/utils';

@Injectable()
export class StockManagerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService
  ) { }

  async createStockManager(createStockManagerDto: CreateStockManagerDto) {
    const existingStockManager = await this.prisma.user.findUnique({ where: { email: createStockManagerDto.email } });
    if (existingStockManager) {
      throw new BadRequestException('Email already taken');
    }
    const hashedPassword = await this.utils.hashPassword(createStockManagerDto.password);

    const stockManager = await this.prisma.user.create({
      data: { ...createStockManagerDto, password: hashedPassword, emailVerified: true, role: 'STOCK_MANAGER', stockOwnerId: createStockManagerDto.stockOwnerId }
    });
    const { password: _, ...stockManagerWithoutPassword } = stockManager;

    return {
      success: true,
      message: "Stock Manager created successfully",
      data: stockManagerWithoutPassword
    }
  }

  async updateStockManager(id: string, updateStockManagerDto: UpdateStockManagerDto) {
    const stockManager = await this.prisma.user.findUnique({ where: { id } });
    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: updateStockManagerDto.fullName,
        userName: updateStockManagerDto.userName,
        phoneNumber: updateStockManagerDto.phoneNumber
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
        stockOwnerId
      },
      include: {
        managedStocks: true
      }
    });
  }

  async getStockManagerById(id: string) {
    const stockManager = await this.prisma.user.findUnique({
      where: { id },
      include: {
        managedStocks: true
      }
    });
    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    return stockManager;
  }

  async disableStockManager(id: string) {
    const stockManager = await this.prisma.user.findUnique({ where: { id } });

    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    const deactivatedStockManager = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'DISABLED'
      }
    });

    const { password: _, ...stockManagerWithoutPassword } = deactivatedStockManager;

    return {
      success: true,
      message: "Stock Manager disabled successfully",
      data: stockManagerWithoutPassword
    }
  }

  async enableStockManager(id: string) {
    const stockManager = await this.prisma.user.findUnique({ where: { id } });
    if (!stockManager) throw new NotFoundException('Stock Manager not found');

    const activatedStockManager = await this.prisma.user.update({
      where: { id },
      data: {
        status: 'ENABLED'
      }
    });

    const { password: _, ...stockManagerWithoutPassword } = activatedStockManager;

    return {
      success: true,
      message: "Stock Manager enabled successfully",
      data: stockManagerWithoutPassword
    }
  }
}
