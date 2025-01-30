import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SuppliersService } from './supplier.service';
import { SupplierDto } from './dto/supplier.dto';
import { RoleGuard, JwtGuard } from 'src/guards';
import { Roles } from 'src/auth/role.decorator';
import { Role, Status } from '@prisma/client';
import { Request } from 'express';
import { UtilsService } from 'src/utils';

@Controller('supplier')
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.ADMIN, Role.STOCK_OWNER, Role.STOCK_MANAGER)
export class SuppliersController {
  constructor(
    private readonly suppliersService: SuppliersService,
    private readonly utils: UtilsService
  ) { }

  @Get()
  @ApiOperation({
    summary: 'Get all suppliers of a stock owner',
    description: 'Fetches a paginated list of suppliers based on user access.',
  })
  
  async findAll(
    @Req() req: Request
  ) {
    const user = await this.utils.getLoggedInUser(req);
    return this.suppliersService.findAll(user.id);
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
  async create(
    @Body() supplierDto: SupplierDto,
    @Req() req: Request
  ) {
    const user = await this.utils.getLoggedInUser(req);
    return this.suppliersService.create({...supplierDto, createdBy: user.id, stockOwnerId: user.stockOwnerId ? user.stockOwnerId : user.id });
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
