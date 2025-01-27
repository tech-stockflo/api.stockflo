// src/stock/stock.module.ts

import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [StockController],
  providers: [StockService, JwtService],
})
export class StockModule { }
