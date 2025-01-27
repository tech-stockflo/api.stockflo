// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma';
import { UtilsModule } from './utils';
import { AuthModule } from './auth';
import { UserManagementModule } from './user-management';
import { SupplierModule } from './supplier';
import { StockManagerModule } from './stock-manager';
import { StockModule } from './stock';
import { ProductModule } from './product';
import { JwtService } from '@nestjs/jwt';

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
export class AppModule {}
