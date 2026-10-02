import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AdviesService } from './advies.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogusItem } from '../catalogus/schemas/catalogus-item.schema';

describe('AdviesService', () => {
  let service: AdviesService;
  let prisma: PrismaService;
  let catalogusModel: any;

  const mockProfile = {
    userId: 'user-1',
    taalniveau: 'B1',
    genre: 'Thriller',
    onderwerp: 'Mysterie',
    lengte: 'Middel',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdviesService,
        {
          provide: PrismaService,
          useValue: {
            readingProfile: {
              findUnique: jest.fn(),
            },
            readingListItem: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: getModelToken(CatalogusItem.name),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdviesService>(AdviesService);
    prisma = module.get<PrismaService>(PrismaService);
    catalogusModel = module.get(getModelToken(CatalogusItem.name));
  });

  it('gooit een NotFoundException als er geen leesprofiel bestaat', async () => {
    (prisma.readingProfile.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.readingListItem.findMany as jest.Mock).mockResolvedValue([]);

    await expect(service.getAdvies('user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('geeft de hoogst scorende items als eerste terug', async () => {
    (prisma.readingProfile.findUnique as jest.Mock).mockResolvedValue(
      mockProfile,
    );
    (prisma.readingListItem.findMany as jest.Mock).mockResolvedValue([]);

    const catalogusItems = [
      {
        _id: 'mock-id-1',
        titel: 'Geen match',
        beschrijving: 'Matcht nergens mee',
        taalniveau: 'C1',
        genre: 'Romantiek',
        onderwerp: 'Liefde',
        lengte: 'Lang',
      },
      {
        _id: 'mock-id-2',
        titel: 'Perfecte match',
        beschrijving: 'Matcht op alles',
        taalniveau: 'B1',
        genre: 'Thriller',
        onderwerp: 'Mysterie',
        lengte: 'Middel',
      },
      {
        _id: 'mock-id-3',
        titel: 'Deels match',
        beschrijving: 'Matcht op twee velden',
        taalniveau: 'B1',
        genre: 'Thriller',
        onderwerp: 'Familie',
        lengte: 'Kort',
      },
    ];

    catalogusModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(catalogusItems),
    });

    const result = await service.getAdvies('user-1');

    expect(result).toHaveLength(3);
    expect(result[0].titel).toBe('Perfecte match');
    expect(result[0].motivatie).toContain('taalniveau');
    expect(result[0].motivatie).toContain('genre');
  });

  it('geeft nog steeds suggesties als niks matcht (randgeval)', async () => {
    (prisma.readingProfile.findUnique as jest.Mock).mockResolvedValue(
      mockProfile,
    );
    (prisma.readingListItem.findMany as jest.Mock).mockResolvedValue([]);

    const catalogusItems = [
      {
        _id: 'mock-id-4',
        titel: 'Boek A',
        beschrijving: '...',
        taalniveau: 'C1',
        genre: 'Romantiek',
        onderwerp: 'Liefde',
        lengte: 'Lang',
      },
      {
        _id: 'mock-id-5',
        titel: 'Boek B',
        beschrijving: '...',
        taalniveau: 'A2',
        genre: 'Fantasy',
        onderwerp: 'Avontuur',
        lengte: 'Kort',
      },
      {
        _id: 'mock-id-6',
        titel: 'Boek C',
        beschrijving: '...',
        taalniveau: 'C1',
        genre: 'Non-fictie',
        onderwerp: 'Wetenschap',
        lengte: 'Lang',
      },
    ];

    catalogusModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(catalogusItems),
    });

    const result = await service.getAdvies('user-1');

    expect(result).toHaveLength(3);
    result.forEach((suggestie) => {
      expect(suggestie.motivatie).toBe(
        'Een titel om eens buiten je gebruikelijke voorkeuren te proberen.',
      );
    });
  });
});
