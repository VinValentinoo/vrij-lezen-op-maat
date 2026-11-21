import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { DocentService } from './docent.service';
import { LeeslijstService } from '../leeslijst/leeslijst.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DocentService', () => {
  let service: DocentService;
  let prisma: {
    studentDocentKoppeling: { findMany: jest.Mock; findUnique: jest.Mock };
  };
  let leeslijstService: { getLeeslijst: jest.Mock; addToLeeslijst: jest.Mock };

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
    prisma = module.get(PrismaService);
    leeslijstService = module.get(LeeslijstService);
  });

  describe('getGekoppeldeStudenten', () => {
    it('geeft nooit gevoelige velden (wachtwoordHash) terug', async () => {
      // Zelfs als de database-laag per ongeluk extra velden teruggeeft,
      // mapt de service ze weg naar id, naam en email.
      prisma.studentDocentKoppeling.findMany.mockResolvedValue([
        {
          id: 'k1',
          student: {
            id: 's1',
            naam: 'Sam',
            email: 'sam@test.nl',
            wachtwoordHash: 'geheim',
            readingProfile: { id: 'p1' },
          },
        },
      ]);

      const result = await service.getGekoppeldeStudenten('docent-1');

      expect(result).toEqual([
        { id: 'k1', user: { id: 's1', naam: 'Sam', email: 'sam@test.nl' } },
      ]);
      expect(JSON.stringify(result)).not.toContain('wachtwoordHash');
    });

    it('vraagt alleen de benodigde velden op (select, geen include)', async () => {
      prisma.studentDocentKoppeling.findMany.mockResolvedValue([]);

      await service.getGekoppeldeStudenten('docent-1');

      const args = prisma.studentDocentKoppeling.findMany.mock.calls[0][0];
      expect(args.where).toEqual({ docentId: 'docent-1' });
      expect(args.include).toBeUndefined();
      expect(args.select.student.select.wachtwoordHash).toBeUndefined();
    });

    it('slaat studenten zonder leesprofiel over (randgeval)', async () => {
      prisma.studentDocentKoppeling.findMany.mockResolvedValue([
        {
          id: 'k1',
          student: {
            id: 's1',
            naam: 'A',
            email: 'a@t.nl',
            readingProfile: null,
          },
        },
      ]);

      await expect(service.getGekoppeldeStudenten('docent-1')).resolves.toEqual(
        [],
      );
    });
  });

  describe('getStudentLeeslijst', () => {
    it('gooit ForbiddenException als de student niet aan de docent gekoppeld is', async () => {
      prisma.studentDocentKoppeling.findUnique.mockResolvedValue(null);

      await expect(
        service.getStudentLeeslijst('docent-1', 'student-9'),
      ).rejects.toThrow(ForbiddenException);
      expect(leeslijstService.getLeeslijst).not.toHaveBeenCalled();
    });

    it('geeft de leeslijst terug als de koppeling bestaat', async () => {
      prisma.studentDocentKoppeling.findUnique.mockResolvedValue({ id: 'k1' });
      leeslijstService.getLeeslijst.mockResolvedValue([{ id: 'i1' }]);

      await expect(
        service.getStudentLeeslijst('docent-1', 'student-1'),
      ).resolves.toEqual([{ id: 'i1' }]);
      expect(prisma.studentDocentKoppeling.findUnique).toHaveBeenCalledWith({
        where: {
          studentId_docentId: { studentId: 'student-1', docentId: 'docent-1' },
        },
      });
    });
  });

  describe('addToStudentLeeslijst', () => {
    it('gooit ForbiddenException zonder koppeling en voegt niets toe', async () => {
      prisma.studentDocentKoppeling.findUnique.mockResolvedValue(null);

      await expect(
        service.addToStudentLeeslijst('docent-1', 'student-9', {
          catalogusItemId: '507f1f77bcf86cd799439011',
        }),
      ).rejects.toThrow(ForbiddenException);
      expect(leeslijstService.addToLeeslijst).not.toHaveBeenCalled();
    });
  });
});
