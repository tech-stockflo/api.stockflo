// src/utils/utils.service.ts

import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { Request } from 'express';
import * as nodemailer from 'nodemailer';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Injectable()
export class UtilsService {
  private smtpTransport;
  constructor(
    private readonly prisma: PrismaService,
    // private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get<string>('SMTP_EMAIL'),
        pass: this.config.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  sendEmail = async (to: string, html: any, subject: string) => {
    try {
      const mailOptions = {
        from: 'info@sms.com',
        to,
        subject,
        html,
      };
      await this.smtpTransport.sendMail(mailOptions);
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  };

  async createToken(
    data: any,
    options: { expiresIn: string },
  ): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.config.get<string>('ACCESS_SECRET_KEY'),
      expiresIn: options.expiresIn,
    });
  }
  async verifyPasswords(pass1: string, pass2: string) {
    return await argon.verify(pass1, pass2);
  }
  async hashPassword(pass: string) {
    return await argon.hash(pass);
  }

  async verifyAccessToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.config.get<string>('ACCESS_SECRET_KEY'),
    });
  }

  async verifyRefreshToken(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.config.get<string>('REFRESH_SECRET_KEY'),
    });
  }

  async generateAccessToken({ id, email, role }) {
    return this.jwtService.sign({ id, email, role }, {
      secret: this.config.get('ACCESS_SECRET_KEY'),
      expiresIn: '1d',
    });
  }

  async generateRefreshToken({ id, email, role }) {
    return this.jwtService.sign({ id, email, role }, {
      secret: this.config.get('REFRESH_SECRET_KEY'),
      expiresIn: '7d',
    });
  }

  async decodeAccessToken(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new BadRequestException('Failed to decode access token');
      }
      return decodedToken;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  async decodeRefreshToken(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new BadRequestException('Failed to decode refresh token');
      }
      return decodedToken;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException(e.message);
    }
  }


  async getLoggedInUser(req: Request) {
    const token = req.headers.authorization || req.cookies?.ACCESS_TOKEN;

    if (token) {
      const { error } = this.jwtService.verify(token.startsWith('Bearer ') ? token.split(' ')[1] : token, {
        secret: this.config.get('ACCESS_SECRET_KEY'),
      });
      if (error)
        throw new BadRequestException(
          'Errow accured while getting the profile ' + error.message,
        );
      const details: any = await this.jwtService.decode(token.startsWith('Bearer ') ? token.split(' ')[1] : token);

      return await this.prisma.user.findUnique({
        where: { id: details.id },
      });
    } else {
      throw new UnauthorizedException(
        'Please you are not authorized to access resource',
      );
    }
  }
}  