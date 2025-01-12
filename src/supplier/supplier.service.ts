// src/suppliers/supplier

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupplierDto } from './dto/supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all suppliers
  async findAll() {
    const suppliers = await this.prisma.supplier.findMany();
    return {
      success: true,
      data: suppliers,
      statusCode: HttpStatus.OK,
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
