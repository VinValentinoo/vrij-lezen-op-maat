import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatalogusService } from './catalogus.service';
import { CatalogusItem } from './schemas/catalogus-item.schema';

describe('CatalogusService', () => {
  let service: CatalogusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogusService,
        {
          provide: getModelToken(CatalogusItem.name),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatalogusService>(CatalogusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
