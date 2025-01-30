// src/suppliers/supplier

import { SupplierDto } from './dto/supplier.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) { }

  // Get all suppliers
  async findAll(userId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })
    
    let suppliers: any[]

    if (user.role === "STOCK_OWNER") {
      suppliers = await this.prisma.supplier.findMany({
        where: {
          stockOwnerId: userId
        }
      })
    }

    if (user.role === "STOCK_MANAGER") {
      const stocks = await this.prisma.stock.findMany({
        where: {
          stockManagers: {
            some: {
              id: user.id
            }
          }
        },
        select: {
          id: true
        }
      })

      const supplierIds = await this.prisma.product.findMany({
        where: {
          stockId: {
            in: stocks.map(stock => stock.id)
          }
        },
        select: {
          supplierId: true
        },
        distinct: ['supplierId']
      })

      suppliers = await this.prisma.supplier.findMany({
        where: {
          id: {
            in: supplierIds.map(supplier => supplier.supplierId)
          }
        }
      })
    }

    return {
      success: true,
      message: "Suppliers retrieved successfully",
      data: suppliers
    }
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
      data: supplier
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
  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const updatedSupplier = await this.prisma.supplier.update({
      where: { id },
      data: updateSupplierDto,
    });

    return {
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier
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
      message: 'Supplier deleted successfully'
    };
  }
}
