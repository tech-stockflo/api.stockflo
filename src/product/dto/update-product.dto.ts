// src/product/dto/update-product.dto.ts

import { IsString, IsInt, Min, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Updated Laptop',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 120,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Threshold value for low stock warning',
    example: 30,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  thresholdValue?: number;

  @ApiProperty({
    description: 'Supplier ID of the product',
    example: 'd3e8f71a-18d4-4bcb-8a8d-c98f0b63adf4',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  supplierId?: string;

  @ApiProperty({
    description: 'Stock ID associated with the product',
    example: 'a7d1a0f1-58bb-4827-bd57-992632ac827b',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  stockId?: string;
}
