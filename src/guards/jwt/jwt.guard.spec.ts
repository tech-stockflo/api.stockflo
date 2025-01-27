// src/guards/jwt/jwt.guard.ts

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from './jwt.guard';
import { JwtService } from '@nestjs/jwt';

describe('JwtGuard', () => {
  it('should be defined', () => {
    const prisma = {} as PrismaService;
    const jwtService = {} as JwtService;
    expect(new JwtGuard(prisma, jwtService)).toBeDefined();
  });
});
