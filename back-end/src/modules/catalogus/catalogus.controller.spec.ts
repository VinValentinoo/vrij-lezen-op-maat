import { Test, TestingModule } from '@nestjs/testing';
import { CatalogusController } from './catalogus.controller';
import { CatalogusService } from './catalogus.service';

describe('CatalogusController', () => {
  let controller: CatalogusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogusController],
      providers: [
        {
          provide: CatalogusService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogusController>(CatalogusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});