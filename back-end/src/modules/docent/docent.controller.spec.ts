import { Test, TestingModule } from '@nestjs/testing';
import { DocentController } from './docent.controller';

describe('DocentController', () => {
  let controller: DocentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocentController],
    }).compile();

    controller = module.get<DocentController>(DocentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
