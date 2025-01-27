import { Module } from '@nestjs/common';
import { SuppliersService } from './supplier.service';
import { SuppliersController } from './supplier.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, JwtService],
})
export class SupplierModule {}