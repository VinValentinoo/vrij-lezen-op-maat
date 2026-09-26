import { Test, TestingModule } from '@nestjs/testing';
import { LeeslijstController } from './leeslijst.controller';
import { LeeslijstService } from './leeslijst.service';

describe('LeeslijstController', () => {
  let controller: LeeslijstController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeeslijstController],
      providers: [
        {
          provide: LeeslijstService,
          useValue: {
            getLeeslijst: jest.fn(),
            addToLeeslijst: jest.fn(),
            toggleStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LeeslijstController>(LeeslijstController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
