import { Module } from '@nestjs/common';
import { SuppliersService } from './supplier.service';
import { SuppliersController } from './supplier.controller';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SupplierModule {}
