// src/app.module.ts

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UtilsModule } from './utils/utils.module';
import { UserManagementModule } from './user-management/user-management.module';
import { SupplierModule } from './supplier/supplier.module';
import { StockModule } from './stock/stock.module';
import { StockManagerModule } from './stock-manager/stock-manager.module';
import { ProductModule } from './product/product.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
    }),
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    PrismaModule,
    UtilsModule,
    UserManagementModule,
    SupplierModule,
    StockManagerModule,
    StockModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
