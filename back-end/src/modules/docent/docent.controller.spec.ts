import { Test, TestingModule } from '@nestjs/testing';
import { DocentController } from './docent.controller';
import { DocentService } from './docent.service';

describe('DocentController', () => {
  let controller: DocentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocentController],
      providers: [
        {
          provide: DocentService,
          useValue: {
            getGekoppeldeStudenten: jest.fn(),
            getStudentLeeslijst: jest.fn(),
            addToStudentLeeslijst: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocentController>(DocentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});