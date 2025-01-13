// src/product/product.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: createProductDto.supplierId }
    })

    if (!supplier) {
      throw new NotFoundException("Supplier not found")
    }

    const stock = await this.prisma.stock.findUnique({
      where: { id: createProductDto.stockId }
    })

    if (!stock) {
      throw new NotFoundException("Stock not found")
    }

    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany({
      include: {
        supplier: true,
        stock: true
      }
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: updateProductDto.supplierId }
    })

    if (!supplier) {
      throw new NotFoundException("Supplier not found")
    }

    const stock = await this.prisma.stock.findUnique({
      where: { id: updateProductDto.stockId }
    })

    if (!stock) {
      throw new NotFoundException("Stock not found")
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.prisma.product.delete({ where: { id } });
  }
}