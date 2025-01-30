// src/auth/suppliers/supplier.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateSupplierDto {
    @ApiProperty({ description: 'Name of the supplier' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Contact information of the supplier' })
    @IsString()
    contact: string;
}