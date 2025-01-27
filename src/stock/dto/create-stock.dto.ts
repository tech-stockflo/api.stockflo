// src/stock/dto/create-stock.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateStockDto {
  @ApiProperty({
    description: 'Name of the stock',
    example: 'Warehouse A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Street address of the stock',
    example: '123 Main Street',
  })
  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @ApiProperty({
    description: 'Status of the stock',
    enum: Status,
    example: 'ENABLED',
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ENABLED;

  @ApiProperty({
    description: 'Stock Owner ID of the stock (stock manager should be connected to this)',
    example: 'uuid-of-owner',
  })
  @IsString()
  @IsNotEmpty()
  stockOwnerId: string;

  @ApiProperty({
    description: 'Manager ID of the stock (stock manager should be connected to this)',
    example: 'uuid-of-manager',
  })
  @IsString()
  @IsNotEmpty()
  stockManagerId: string;
}