import { Test, TestingModule } from '@nestjs/testing';
import { LeeslijstService } from './leeslijst.service';

describe('LeeslijstService', () => {
  let service: LeeslijstService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeeslijstService],
    }).compile();

    service = module.get<LeeslijstService>(LeeslijstService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
