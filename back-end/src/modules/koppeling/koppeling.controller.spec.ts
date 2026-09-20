import { Test, TestingModule } from '@nestjs/testing';
import { KoppelingController } from './koppeling.controller';

describe('KoppelingController', () => {
  let controller: KoppelingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KoppelingController],
    }).compile();

    controller = module.get<KoppelingController>(KoppelingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
