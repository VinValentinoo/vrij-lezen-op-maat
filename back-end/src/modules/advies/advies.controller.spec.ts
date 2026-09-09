import { Test, TestingModule } from '@nestjs/testing';
import { AdviesController } from './advies.controller';
import { AdviesService } from './advies.service';

describe('AdviesController', () => {
  let controller: AdviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdviesController],
      providers: [
        {
          provide: AdviesService,
          useValue: {
            getAdvies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdviesController>(AdviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});