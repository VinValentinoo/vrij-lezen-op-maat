import { Test, TestingModule } from '@nestjs/testing';
import { KoppelingService } from './koppeling.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('KoppelingService', () => {
  let service: KoppelingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KoppelingService,
        {
          provide: PrismaService,
          useValue: {
            user: { findMany: jest.fn() },
            studentDocentKoppeling: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<KoppelingService>(KoppelingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});