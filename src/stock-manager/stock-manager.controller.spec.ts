// src/stock-manager/stock-manager.controller.spec.dto.ts

import { Test, TestingModule } from '@nestjs/testing';
import { StockManagerController } from './stock-manager.controller';
import { StockManagerService } from './stock-manager.service';

describe('StockManagerController', () => {
  let controller: StockManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockManagerController],
      providers: [StockManagerService],
    }).compile();

    controller = module.get<StockManagerController>(StockManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
