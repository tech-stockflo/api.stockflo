// src/guards/role/role.guard.spec.tss

import { Reflector } from '@nestjs/core';
import { RoleGuard } from './role.guard';
import { JwtService } from '@nestjs/jwt';

describe('RoleGuard', () => {
  it('should be defined', () => {
    const reflector = {} as Reflector;
    const jwtService = {} as JwtService;
    expect(new RoleGuard(reflector, jwtService)).toBeDefined();
  });
});
