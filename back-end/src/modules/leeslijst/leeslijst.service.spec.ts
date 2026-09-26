import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LeeslijstService } from './leeslijst.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogusItem } from '../catalogus/schemas/catalogus-item.schema';

describe('LeeslijstService', () => {
  let service: LeeslijstService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeeslijstService,
        {
          provide: getModelToken(CatalogusItem.name),
          useValue: { find: jest.fn() },
        },
        {
          provide: PrismaService,
          useValue: {
            readingListItem: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LeeslijstService>(LeeslijstService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});