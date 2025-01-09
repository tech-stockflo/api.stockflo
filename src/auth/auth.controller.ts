// src/auth/auth.controller.ts

import { Controller, Post, Body, Res, HttpStatus, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from 'src/auth/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetEmailDto, SendActivationEmailDto } from './dto/send-email.dto';
import { ChangePasswordDto, ResetPasswordDto, VerifyResetCodeDto } from './dto/reset-password.dto';
import { ActivateAccountDto, DisableAcountDto } from './dto/account.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'This endpoint registers a new user and returns authentication tokens.',
  })
  @ApiBody({
    description: 'User registration details',
    type: UserDto,
  })
  async register(@Body() registerDto: UserDto, @Res() res: Response) {
    const { data } = await this.authService.register(registerDto);

    res.cookie('ACCESS_TOKEN', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.cookie('REFRESH_TOKEN', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Account created successfully',
      data: process.env.NODE_ENV === 'production' ? data.user : data
    });
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description: 'This endpoint logs in a user and returns authentication tokens.',
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDto,
  })
  async login(@Body() credentials: LoginDto, @Res() res: Response) {
    const { data } = await this.authService.login(credentials);

    res.cookie('ACCESS_TOKEN', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.cookie('REFRESH_TOKEN', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Account logged in successfully',
      data: process.env.NODE_ENV === 'production' ? data.user : data
    });
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Logout a user',
    description: 'This endpoint logs out a user by clearing their authentication tokens.',
  })
  async logout(@Res() res: Response) {
    res.clearCookie('ACCESS_TOKEN');
    res.clearCookie('REFRESH_TOKEN');

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh user authentication token',
    description: 'This endpoint refreshes the authentication token using the refresh token.',
  })
  @ApiBody({
    description: 'Refresh token details',
    type: RefreshTokenDto,
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
    const { data } = await this.authService.refreshToken(refreshTokenDto);

    res.cookie('ACCESS_TOKEN', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Token refreshed successfully',
    });
  }

  @Post('send-reset-password-email')
  @ApiOperation({
    summary: 'Send reset password email',
    description: 'This endpoint sends a reset password email to the user.',
  })
  @ApiBody({
    description: 'User email for reset password request',
    type: ResetEmailDto,
  })
  async sendResetPasswordEmail(@Body() resetEmailDto: ResetEmailDto) {
    return this.authService.sendResetPasswordEmail(resetEmailDto);
  }

  @Post('verify-reset-password-code')
  @ApiOperation({
    summary: 'Verify reset password code',
    description: 'This endpoint verifies the reset password code sent to the user.',
  })
  @ApiBody({
    description: 'Reset password verification code',
    type: VerifyResetCodeDto,
  })
  async verifyResetPasswordCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.authService.verifyResetPasswordCode(verifyResetCodeDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset user password',
    description: 'This endpoint allows the user to reset their password.',
  })
  @ApiBody({
    description: 'New password details',
    type: ResetPasswordDto,
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password/:userId')
  @ApiOperation({
    summary: 'Change user password',
    description: 'This endpoint changes the password for a specific user.',
  })
  @ApiBody({
    description: 'New password details',
    type: ChangePasswordDto,
  })
  async changePassword(
    @Param('userId') userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    changePasswordDto.userId = userId;
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('send-activation-email')
  @ApiOperation({
    summary: 'Send an activation email to the user',
    description: 'This endpoint sends an activation email to the specified email address.',
  })
  @ApiBody({
    description: 'Email address of the user requesting activation',
    type: SendActivationEmailDto,
  })
  async sendActivationEmail(@Body() sendActivationEmailDto: SendActivationEmailDto) {
    return this.authService.sendActivationEmail(sendActivationEmailDto);
  }

  @Post('activate-account')
  @ApiOperation({
    summary: 'Activate user account',
    description: 'This endpoint activates a user account using the activation code.',
  })
  @ApiBody({
    description: 'Activation code details',
    type: ActivateAccountDto,
  })
  async activateAccount(@Body() activateAccountDto: ActivateAccountDto) {
    return this.authService.activateAccount(activateAccountDto);
  }
}