import { Test, TestingModule } from '@nestjs/testing';
import { DocentService } from './docent.service';
import { LeeslijstService } from '../leeslijst/leeslijst.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DocentService', () => {
  let service: DocentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocentService,
        {
          provide: LeeslijstService,
          useValue: {
            getLeeslijst: jest.fn(),
            addToLeeslijst: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            studentDocentKoppeling: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DocentService>(DocentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
