// src/stock-manager/stock-manager.module.dto.ts

import { Module } from '@nestjs/common';
import { StockManagerService } from './stock-manager.service';
import { StockManagerController } from './stock-manager.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports: [
      JwtModule.register({
        secret: process.env.ACCESS_SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      }),
    ],
  controllers: [StockManagerController],
  providers: [StockManagerService],
})
export class StockManagerModule {}
