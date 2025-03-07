// src/stock-manager/dto/update-stock-manager.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateStockManagerDto {
  @ApiProperty({
    description: 'The full name of the stock manager',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    description: 'The username of the stock manager',
    example: 'stock_manager_01',
    required: false,
  })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({
    description: 'The Phone number of the stock manager',
    enum: Status,
    example: '+250783030869',
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  phoneNumber?: string;
}