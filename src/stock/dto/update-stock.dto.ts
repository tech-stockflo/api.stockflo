// src/stock/dto/update-stock.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateStockDto {
    @ApiProperty({
        description: 'Name of the stock',
        example: 'Updated Warehouse A',
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: 'Street address of the stock',
        example: '456 Elm Street',
        required: false,
    })
    @IsString()
    @IsOptional()
    streetAddress?: string;

    @ApiProperty({
        description: 'Status of the stock',
        enum: Status,
        example: 'DISABLED',
        required: false,
    })
    @IsEnum(Status)
    @IsOptional()
    status?: Status;
}