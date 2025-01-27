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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (defaults to 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (defaults to 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: Status,  // Enum for status values (ENABLED or DISABLED)
    description: 'Filter suppliers by their status (defaults to "ENABLED")',
    example: 'ENABLED',
  })
  async findAll(
    @Query() query: { page?: number; limit?: number; status?: Status },
    @Req() req: Request
  ) {
    const { page = 1, limit = 10, status = 'ENABLED' } = query;
    const accessToken = req.cookies['ACCESS_TOKEN'] || req.headers['authorization']?.split(' ')[1];
    const decodedToken = await this.utils.decodeAccessToken(accessToken);
    const userId = decodedToken.id;
    return this.suppliersService.findAll({ page, limit, status, userId });
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
