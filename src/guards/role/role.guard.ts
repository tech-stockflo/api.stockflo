// src/guards/role/role.guards.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ROLES_KEY } from 'src/auth/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1] || request.cookies?.ACCESS_TOKEN;

    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    try {
      const decodedToken = this.jwtService.verify(token, { secret: process.env.ACCESS_SECRET_KEY });
      request['user'] = {
        userId: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      };

      if (!roles.includes(decodedToken.role)) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Token has expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
