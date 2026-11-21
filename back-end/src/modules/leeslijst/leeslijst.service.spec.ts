import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Prisma } from '@prisma/client';
import { LeeslijstService } from './leeslijst.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogusItem } from '../catalogus/schemas/catalogus-item.schema';

const BOEK_ID = '507f1f77bcf86cd799439011';

describe('LeeslijstService', () => {
  let service: LeeslijstService;
  let prisma: {
    readingListItem: {
      findMany: jest.Mock;
      create: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let catalogusModel: { find: jest.Mock };

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
    prisma = module.get(PrismaService);
    catalogusModel = module.get(getModelToken(CatalogusItem.name));
  });

  describe('getLeeslijst', () => {
    it('combineert Postgres-items met titel en beschrijving uit Mongo', async () => {
      prisma.readingListItem.findMany.mockResolvedValue([
        { id: 'i1', status: 'NIET_GELEZEN', catalogusItemId: BOEK_ID },
      ]);
      catalogusModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([
          { _id: { toString: () => BOEK_ID }, titel: 'Titel', beschrijving: 'Uitleg' },
        ]),
      });

      await expect(service.getLeeslijst('u1')).resolves.toEqual([
        { id: 'i1', status: 'NIET_GELEZEN', titel: 'Titel', beschrijving: 'Uitleg' },
      ]);
    });

    it('geeft een lege lijst terug als de gebruiker niets heeft toegevoegd (randgeval)', async () => {
      prisma.readingListItem.findMany.mockResolvedValue([]);
      catalogusModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await expect(service.getLeeslijst('u1')).resolves.toEqual([]);
    });
  });

  describe('addToLeeslijst', () => {
    it('voegt een boek toe voor de ingelogde gebruiker', async () => {
      prisma.readingListItem.create.mockResolvedValue({ id: 'i1' });

      await service.addToLeeslijst('u1', { catalogusItemId: BOEK_ID });

      expect(prisma.readingListItem.create).toHaveBeenCalledWith({
        data: { userId: 'u1', catalogusItemId: BOEK_ID },
      });
    });

    it('gooit ConflictException als het boek er al in staat (P2002)', async () => {
      prisma.readingListItem.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dubbel', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(
        service.addToLeeslijst('u1', { catalogusItemId: BOEK_ID }),
      ).rejects.toThrow(ConflictException);
    });

    it('gooit andere fouten gewoon door (geen valse "staat er al in"-melding)', async () => {
      const fout = new Error('database onbereikbaar');
      prisma.readingListItem.create.mockRejectedValue(fout);

      await expect(
        service.addToLeeslijst('u1', { catalogusItemId: BOEK_ID }),
      ).rejects.toBe(fout);
    });
  });

  describe('toggleStatus', () => {
    it('zet NIET_GELEZEN om naar GELEZEN voor een eigen item', async () => {
      prisma.readingListItem.findUnique.mockResolvedValue({
        id: 'i1',
        userId: 'u1',
        status: 'NIET_GELEZEN',
      });
      prisma.readingListItem.update.mockResolvedValue({ id: 'i1', status: 'GELEZEN' });

      await service.toggleStatus('u1', 'i1');

      expect(prisma.readingListItem.update).toHaveBeenCalledWith({
        where: { id: 'i1' },
        data: { status: 'GELEZEN' },
      });
    });

    it('zet GELEZEN terug naar NIET_GELEZEN', async () => {
      prisma.readingListItem.findUnique.mockResolvedValue({
        id: 'i1',
        userId: 'u1',
        status: 'GELEZEN',
      });
      prisma.readingListItem.update.mockResolvedValue({});

      await service.toggleStatus('u1', 'i1');

      expect(prisma.readingListItem.update).toHaveBeenCalledWith({
        where: { id: 'i1' },
        data: { status: 'NIET_GELEZEN' },
      });
    });

    it('gooit NotFoundException bij het item van een andere gebruiker', async () => {
      prisma.readingListItem.findUnique.mockResolvedValue({
        id: 'i1',
        userId: 'andere-gebruiker',
        status: 'NIET_GELEZEN',
      });

      await expect(service.toggleStatus('u1', 'i1')).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.readingListItem.update).not.toHaveBeenCalled();
    });

    it('gooit NotFoundException als het item niet bestaat', async () => {
      prisma.readingListItem.findUnique.mockResolvedValue(null);

      await expect(service.toggleStatus('u1', 'i1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
