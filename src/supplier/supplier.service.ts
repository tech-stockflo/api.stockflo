// src/suppliers/supplier

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupplierDto } from './dto/supplier.dto';
import { Status } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) { }

  // Get all suppliers
  async findAll(query: { page: number; limit: number; status?: Status; userId?: string }) {
    const { page, limit, status, userId } = query;
  
    const skip = (page - 1) * limit;
    const take = parseInt(limit.toString(), 10); 
    const filters: any = {};
  
    if (status) {
      filters.status = status;
    }
  
    if (userId) {
      const stocks = await this.prisma.stock.findMany({
        where: {
          user: { id: userId }
        },
        select: {
          id: true,
        },
      });
  
      if (stocks.length === 0) {
        return {
          success: false,
          message: "No stock found for this user",
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
  
      const stockIds = stocks.map(stock => stock.id);
      filters.Product = {
        some: {
          stockId: { in: stockIds },
        },
      };
    }
  
    const suppliers = await this.prisma.supplier.findMany({
      where: filters,
      skip,
      take,
      include: {
        // Product: {
        //   take: 2
        // },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    const totalSuppliers = await this.prisma.supplier.count({
      where: filters,
    });
  
    return {
      success: true,
      data: suppliers,
      statusCode: HttpStatus.OK,
      pagination: {
        page,
        limit,
        total: totalSuppliers,
        totalPages: Math.ceil(totalSuppliers / limit),
      },
    };
  }
  
  
  

  // Get supplier by ID
  async findOne(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return {
      success: true,
      data: supplier,
      statusCode: HttpStatus.OK,
    };
  }

  // Create a new supplier
  async create(supplierDto: SupplierDto) {
    const supplier = await this.prisma.supplier.create({
      data: supplierDto,
    });

    return {
      success: true,
      message: 'Supplier created successfully',
      data: supplier,
      statusCode: HttpStatus.CREATED,
    };
  }

  // Update an existing supplier
  async update(id: string, supplierDto: SupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const updatedSupplier = await this.prisma.supplier.update({
      where: { id },
      data: supplierDto,
    });

    return {
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
      statusCode: HttpStatus.OK,
    };
  }

  // Delete a supplier
  async remove(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    await this.prisma.supplier.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Supplier deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
