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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
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
