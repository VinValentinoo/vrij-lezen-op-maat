import { Test, TestingModule } from '@nestjs/testing';
import { CatalogusService } from './catalogus.service';

describe('CatalogusService', () => {
  let service: CatalogusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogusService],
    }).compile();

    service = module.get<CatalogusService>(CatalogusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
