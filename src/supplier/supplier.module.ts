import { Module } from '@nestjs/common';
import { SuppliersService } from './supplier.service';
import { SuppliersController } from './supplier.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SupplierModule { }
