// src/guards/jwt/jwt.guard.ts

import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1] || request.cookies?.ACCESS_TOKEN;

    if (!token) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action.',
      );
    }

    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET_KEY }) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new UnauthorizedException('Unauthorized.');
      }

      req.user = user;
      return true;
    } catch (error) {
      console.error('Token verification or user retrieval error:', error);
      throw new InternalServerErrorException('Error while verifying token.');
    }
  }
}