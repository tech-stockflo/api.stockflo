// src/product/product.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/role.decorator';
import { RoleGuard } from 'src/guards/role/role.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller('products')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles(Role.ADMIN, Role.STOCK_OWNER, Role.STOCK_MANAGER)
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product with pictures' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update product data with pictures',
    type: UpdateProductDto,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'pictures', maxCount: 5 }]))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: { pictures?: Express.Multer.File[] }
  ) {
    const picturePaths = files.pictures?.map(file => file.path) || [];
    return this.productService.update(id, { ...updateProductDto, pictures: picturePaths });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }


}