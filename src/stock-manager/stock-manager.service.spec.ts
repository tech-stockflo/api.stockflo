// src/stock-manager/stock-manager.service.spec.dto.ts

import { Test, TestingModule } from '@nestjs/testing';
import { StockManagerService } from './stock-manager.service';

describe('StockManagerService', () => {
  let service: StockManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockManagerService],
    }).compile();

    service = module.get<StockManagerService>(StockManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
