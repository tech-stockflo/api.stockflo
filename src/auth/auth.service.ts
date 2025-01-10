// src/auth/auth.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from 'src/utils/utils.service';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { LoginDto } from './dto/login.dto';
import { UserDto } from 'src/auth/dto/user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetEmailDto, SendActivationEmailDto } from './dto/send-email.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { ActivateAccountDto, ChangeEmailDto } from './dto/account.dto';

@Injectable()
export class AuthService {
  private rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60 * 5,
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) { }

  // Register
  async register(registerDto: UserDto) {
    const { email, password, userName, fullName } = registerDto;    
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.utils.hashPassword(password);
    
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        userName: userName,
        fullName: fullName,
      },
    });

    const accessToken = await this.utils.generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    const refreshToken = await this.utils.generateRefreshToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })
    
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: 'User registered successfully',
      data: { user: userWithoutPassword, refreshToken, accessToken }
    };
  }

  // Login
  async login(credentials: LoginDto) {
    const { email, password } = credentials;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: email }],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found or account is deactivated');
    }

    if(user.status === 'DISABLED'){
      throw new UnauthorizedException('Account disabled')
    }

    try {
      await this.rateLimiter.consume(email);
      const passwordMatches = await this.utils.verifyPasswords(
        user.password,
        password,
      );
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = await this.utils.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      const refreshToken = await this.utils.generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      })
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Successfully logged in',
        data: { user: userWithoutPassword, accessToken, refreshToken },
      };

    } catch (err) {
      if (err instanceof RateLimiterRes) {
        throw new UnauthorizedException(
          'Too many login attempts. Please try again later.',
        );
      }
      throw err;
    }
  }

  // Refresh Token
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    let decodedToken;
    try {
      decodedToken = await this.utils.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newAccessToken = await this.utils.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      message: 'Access token refreshed successfully',
      data: { accessToken: newAccessToken },
    };
  }

  //Send Reset Password Email
  async sendResetPasswordEmail(resetEmailDto: ResetEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resetEmailDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException(
        'Please activate your account before resetting the password',
      );
    }

    try {
      // Apply rate limiting based on the user's email
      await this.rateLimiter.consume(resetEmailDto.email);

      const resetCode = Math.floor(1000 + Math.random() * 9000);

      // Send the reset code to the user's email
      const resetCodeMessage = `Your password reset code is: ${resetCode}`;

      await this.utils.sendEmail(
        user.email,
        resetCodeMessage,
        'Password Reset Code - SMS',
      );

      const storedCode = await this.prisma.userVerificationCodes.create({
        data: {
          otp: resetCode.toString(),
          userId: user.id,
          email: user.email
        }
      })

      return {
        success: true,
        message: 'A password reset code has been sent to your email',
        status: HttpStatus.OK,
      };
    } catch (err) {
      if (err instanceof RateLimiterRes) {
        throw new UnauthorizedException(
          'Too many requests. Please try again later.',
        );
      }
      throw err;
    }
  }

  // Verify Reset Password Code
  async verifyResetPasswordCode(resetPasswordDto: Partial<ResetPasswordDto>) {
    const user = await this.prisma.user.findUnique({
      where: { email: resetPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const storedCode = await this.prisma.userVerificationCodes.findFirst({
      where: {
        otp: resetPasswordDto.code,
        userId: user.id,
      },
    });

    if (!storedCode) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Check if the code is expired
    const currentTime = new Date();
    const codeTime = new Date(storedCode.createdAt);
    const diff = currentTime.getTime() - codeTime.getTime();
    const diffMinutes = Math.floor(diff / 60000);

    if (diffMinutes > 10) {
      throw new UnauthorizedException('Code has expired');
    }

    return {
      success: true,
      message: 'Code verified successfully',
      status: HttpStatus.OK,
    };
  }

  // Reset Password Code
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resetPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const storedCode = await this.prisma.userVerificationCodes.findFirst({
      where: {
        otp: resetPasswordDto.code,
        userId: user.id,
      },
    });

    if (!storedCode) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Check if the code is expired
    const currentTime = new Date();
    const codeTime = new Date(storedCode.createdAt);
    const diff = currentTime.getTime() - codeTime.getTime();
    const diffMinutes = Math.floor(diff / 60000);

    if (diffMinutes > 10) {
      throw new UnauthorizedException('Code has expired');
    }

    const hashedPassword = await this.utils.hashPassword(resetPasswordDto.password);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the code from the database
    await this.prisma.userVerificationCodes.delete({
      where: {
        id: storedCode.id,
      },
    });

    return {
      success: true,
      message: 'Code verified successfully',
    };
  }

  // Change Password
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: changePasswordDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatches = await this.utils.verifyPasswords(
      user.password,
      changePasswordDto.oldPassword,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await this.utils.hashPassword(changePasswordDto.password);

    await this.prisma.user.update({
      where: { id: changePasswordDto.userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  // Send Activation Email
  async sendActivationEmail(sendActivationEmailDto: SendActivationEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: sendActivationEmailDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Account already activated');
    }

    try {
      // Apply rate limiting based on the user's email
      await this.rateLimiter.consume(sendActivationEmailDto.email);

      const activationCode = Math.floor(1000 + Math.random() * 9000);

      // Send the activation code to the user's email
      const activationCodeMessage = `Your account activation code is: ${activationCode}`;

      await this.utils.sendEmail(
        user.email,
        activationCodeMessage,
        'Account Activation Code - SMS',
      );

      const storedCode = await this.prisma.userVerificationCodes.create({
        data: {
          otp: activationCode.toString(),
          userId: user.id,
          email: user.email
        }
      })

      return {
        success: true,
        message: 'An account activation code has been sent to your email',
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      if (err instanceof RateLimiterRes) {
        throw new UnauthorizedException(
          'Too many requests. Please try again later.',
        );
      }
      throw err;
    }
  }

  // Activate Account
  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: activateAccountDto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Account already activated');
    }

    const storedCode = await this.prisma.userVerificationCodes.findFirst({
      where: {
        otp: activateAccountDto.code,
        userId: user.id,
      },
    });

    if (!storedCode) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Check if the code is expired
    const currentTime = new Date();
    const codeTime = new Date(storedCode.createdAt);
    const diff = currentTime.getTime() - codeTime.getTime();
    const diffMinutes = Math.floor(diff / 60000);
    if (diffMinutes > 10) {
      throw new UnauthorizedException('Code has expired');
    }

    // Delete the code from the database
    await this.prisma.userVerificationCodes.delete({
      where: {
        id: storedCode.id,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
      },
    });
    return {
      success: true,
      message: 'Account activated successfully',
    };
  }


  // Change user email 
  async changeUserEmail(changeEmailDto: ChangeEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: changeEmailDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Apply rate limiting based on the user's email
      await this.rateLimiter.consume(changeEmailDto.newEmail);

      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }

      await this.prisma.user.update({
        where: { id: changeEmailDto.userId },
        data: { email: changeEmailDto.newEmail }
      })

      return {
        success: true,
        message: 'Email changed successfully',
        statusCode: HttpStatus.OK,
      };
      
    } catch (err) {
      if (err instanceof RateLimiterRes) {
        throw new UnauthorizedException(
          'Too many requests. Please try again later.',
        );
      }
      throw err;
    }
  }
}