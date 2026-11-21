import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AdviesService } from './advies.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogusService } from '../catalogus/catalogus.service';

// Gebruikt dezelfde waarden als de echte catalogus (2F/3F-schaal).
const mockProfile = {
  userId: 'user-1',
  taalniveau: '3F',
  genre: 'Boek - roman',
  onderwerp: 'reizen',
  lengte: 'Middel',
};

function item(id: string, titel: string, velden: Partial<typeof mockProfile>) {
  return {
    _id: { toString: () => id },
    titel,
    beschrijving: `Beschrijving van ${titel}`,
    taalniveau: '2F',
    genre: 'Krant',
    onderwerp: 'oorlog',
    lengte: 'Lang',
    ...velden,
  };
}

describe('AdviesService', () => {
  let service: AdviesService;
  let prisma: {
    readingProfile: { findUnique: jest.Mock };
    readingListItem: { findMany: jest.Mock };
  };
  let catalogusService: { findAllItems: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdviesService,
        {
          provide: PrismaService,
          useValue: {
            readingProfile: { findUnique: jest.fn() },
            readingListItem: { findMany: jest.fn() },
          },
        },
        {
          provide: CatalogusService,
          useValue: { findAllItems: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AdviesService>(AdviesService);
    prisma = module.get(PrismaService);
    catalogusService = module.get(CatalogusService);

    prisma.readingListItem.findMany.mockResolvedValue([]);
  });

  it('gooit een NotFoundException als er geen leesprofiel bestaat', async () => {
    prisma.readingProfile.findUnique.mockResolvedValue(null);

    await expect(service.getAdvies('user-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(catalogusService.findAllItems).not.toHaveBeenCalled();
  });

  it('geeft de hoogst scorende items als eerste terug', async () => {
    prisma.readingProfile.findUnique.mockResolvedValue(mockProfile);
    catalogusService.findAllItems.mockResolvedValue([
      item('id-1', 'Geen match', {}),
      item('id-2', 'Perfecte match', {
        taalniveau: '3F',
        genre: 'Boek - roman',
        onderwerp: 'reizen',
        lengte: 'Middel',
      }),
      item('id-3', 'Deels match', { taalniveau: '3F', genre: 'Boek - roman' }),
    ]);

    const result = await service.getAdvies('user-1');

    expect(result).toHaveLength(3);
    expect(result[0].titel).toBe('Perfecte match');
    expect(result[0].catalogusItemId).toBe('id-2');
    expect(result[0].motivatie).toContain('taalniveau');
    expect(result[0].motivatie).toContain('genre');
  });

  it('sluit titels die al op de leeslijst staan uit', async () => {
    prisma.readingProfile.findUnique.mockResolvedValue(mockProfile);
    prisma.readingListItem.findMany.mockResolvedValue([
      { catalogusItemId: 'id-2' },
    ]);
    catalogusService.findAllItems.mockResolvedValue([
      item('id-1', 'Boek A', {}),
      item('id-2', 'Al toegevoegd', { taalniveau: '3F' }),
    ]);

    const result = await service.getAdvies('user-1');

    expect(result.map((r) => r.catalogusItemId)).toEqual(['id-1']);
  });

  it('geeft nog steeds suggesties als niks matcht (randgeval)', async () => {
    prisma.readingProfile.findUnique.mockResolvedValue(mockProfile);
    catalogusService.findAllItems.mockResolvedValue([
      item('id-4', 'Boek A', {}),
      item('id-5', 'Boek B', {}),
      item('id-6', 'Boek C', {}),
    ]);

    const result = await service.getAdvies('user-1');

    expect(result).toHaveLength(3);
    result.forEach((suggestie) => {
      expect(suggestie.motivatie).toBe(
        'Een titel om eens buiten je gebruikelijke voorkeuren te proberen.',
      );
    });
  });
});
