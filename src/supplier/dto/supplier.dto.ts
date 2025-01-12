// src/auth/suppliers/supplier.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SupplierDto {
    @ApiProperty({ description: 'Name of the supplier' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Contact information of the supplier' })
    @IsString()
    contact: string;
}