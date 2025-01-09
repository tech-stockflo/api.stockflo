// src/auth/dto/send-email.dto.ts

import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetEmailDto {
    @ApiProperty({
        description: 'The email address of the user requesting the password reset',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;
}

export class SendActivationEmailDto {
    @ApiProperty({
        description: 'The email address of the user requesting the activation email',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;
}