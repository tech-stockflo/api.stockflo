// src/stock-manager/dto/create-stock-manager.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateStockManagerDto {
  @ApiProperty({
    description: 'The email of the stock manager',
    example: 'manager@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The username of the stock manager',
    example: 'stock_manager_01',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'The full name of the stock manager',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'The password for the stock manager account',
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The status of the stock manager',
    enum: Status,
    example: 'ENABLED',
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = 'ENABLED';
}
