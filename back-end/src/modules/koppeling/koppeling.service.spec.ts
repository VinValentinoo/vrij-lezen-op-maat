import { Test, TestingModule } from '@nestjs/testing';
import { KoppelingService } from './koppeling.service';

describe('KoppelingService', () => {
  let service: KoppelingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KoppelingService],
    }).compile();

    service = module.get<KoppelingService>(KoppelingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
