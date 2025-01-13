// src/product/dto/create-product.dto.ts

import { IsString, IsInt, Min, Max, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Name of the product',
        example: 'Laptop',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 100,
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    quantity: number;

    @ApiProperty({
        description: 'Threshold value for low stock warning',
        example: 20,
    })
    @IsInt()
    @Min(0)
    thresholdValue: number;

    @ApiProperty({
        description: 'Supplier ID of the product',
        example: 'd3e8f71a-18d4-4bcb-8a8d-c98f0b63adf4',
    })
    @IsUUID()
    supplierId: string;

    @ApiProperty({
        description: 'Stock ID associated with the product',
        example: 'a7d1a0f1-58bb-4827-bd57-992632ac827b',
    })
    @IsUUID()
    stockId: string;
}