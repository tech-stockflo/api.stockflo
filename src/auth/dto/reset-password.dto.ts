// src/auth/dto/reset-password.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({
        description: 'The password reset code sent to the user',
        example: '1234',
    })
    @IsString()
    @MinLength(4)
    code: string;

    @ApiProperty({
        description: 'The email of the user requesting the password reset',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The new password for the user',
        example: 'newPassword123',
    })
    @IsString()
    @MinLength(8)
    password: string;
}

export class VerifyResetCodeDto {
    @ApiProperty({
        description: 'The email of the user requesting the password reset',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password reset code sent to the user',
        example: '1234',
    })
    @IsString()
    @MinLength(4)
    code: string;
}

export class ChangePasswordDto {
    @IsString()
    @MinLength(4)
    userId: string;

    @ApiProperty({
        description: 'The current password of the user',
        example: 'oldPassword123',
    })
    @IsString()
    @MinLength(8)
    oldPassword: string;

    @ApiProperty({
        description: 'The new password for the user',
        example: 'newPassword123',
    })
    @IsString()
    @MinLength(8)
    password: string;
}