// src/auth/dto/account.dto.ts

import { IsString, IsNotEmpty, Length, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivateAccountDto {
    @ApiProperty({
        description: 'The activation code sent to the user\'s email',
        example: '1234',
    })
    @IsString()
    @IsNotEmpty()
    @Length(4)
    code: string;

    @ApiProperty({
        description: 'The email address of the user',
        example: 'user@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class DisableAcountDto {
    @IsString()
    userId: string;
}