import { Test, TestingModule } from '@nestjs/testing';
import { DocentService } from './docent.service';

describe('DocentService', () => {
  let service: DocentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocentService],
    }).compile();

    service = module.get<DocentService>(DocentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
