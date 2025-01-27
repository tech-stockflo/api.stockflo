// src/stock-manager/stock-manager.module.dto.ts

import { Module } from '@nestjs/common';
import { StockManagerService } from './stock-manager.service';
import { StockManagerController } from './stock-manager.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [StockManagerController],
  providers: [StockManagerService, JwtService],
})
export class StockManagerModule {}
