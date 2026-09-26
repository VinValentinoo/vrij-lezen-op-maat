import { Test, TestingModule } from '@nestjs/testing';
import { KoppelingController } from './koppeling.controller';
import { KoppelingService } from './koppeling.service';

describe('KoppelingController', () => {
  let controller: KoppelingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KoppelingController],
      providers: [
        {
          provide: KoppelingService,
          useValue: {
            getDocenten: jest.fn(),
            koppelAanDocent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<KoppelingController>(KoppelingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});