import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { SuppliersService } from './supplier.service';
import { SupplierDto } from './dto/supplier.dto';

@Controller('supplier')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all suppliers',
    description: 'Fetches a list of all registered suppliers.',
  })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a supplier by ID',
    description: 'Fetches details of a supplier by their unique ID.',
  })
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new supplier',
    description: 'Registers a new supplier and returns the created supplier details.',
  })
  @ApiBody({
    description: 'Supplier registration details',
    type: SupplierDto,
  })
  create(@Body() supplierDto: SupplierDto) {
    return this.suppliersService.create(supplierDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a supplier',
    description: 'Updates the details of an existing supplier by their ID.',
  })
  @ApiBody({
    description: 'Updated supplier details',
    type: SupplierDto,
  })
  update(@Param('id') id: string, @Body() supplierDto: SupplierDto) {
    return this.suppliersService.update(id, supplierDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a supplier',
    description: 'Deletes a supplier by their unique ID.',
  })
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
