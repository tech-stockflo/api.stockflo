// src/stock/stock.module.ts

import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule { }
