// src/stock-manager/dto/create-stock-manager.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
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
    description: 'Phone number of the stock manager',
    example: '+250783030863 | 0783030863',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(13)
  phoneNumber: string;

  @ApiProperty({
    description: 'The password for the stock manager account',
    example: 'securepassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  stockOwnerId: string;
}