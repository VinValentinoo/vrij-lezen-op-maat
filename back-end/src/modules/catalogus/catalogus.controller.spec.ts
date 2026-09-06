import { Test, TestingModule } from '@nestjs/testing';
import { CatalogusController } from './catalogus.controller';

describe('CatalogusController', () => {
  let controller: CatalogusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogusController],
    }).compile();

    controller = module.get<CatalogusController>(CatalogusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
