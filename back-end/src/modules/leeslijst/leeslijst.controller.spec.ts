import { Test, TestingModule } from '@nestjs/testing';
import { LeeslijstController } from './leeslijst.controller';

describe('LeeslijstController', () => {
  let controller: LeeslijstController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeeslijstController],
    }).compile();

    controller = module.get<LeeslijstController>(LeeslijstController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
