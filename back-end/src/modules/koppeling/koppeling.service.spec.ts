import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { KoppelingService } from './koppeling.service';
import { PrismaService } from '../../prisma/prisma.service';

function prismaFout(code: string) {
  return new Prisma.PrismaClientKnownRequestError('fout', {
    code,
    clientVersion: 'test',
  });
}

describe('KoppelingService', () => {
  let service: KoppelingService;
  let prisma: {
    user: { findMany: jest.Mock; findUnique: jest.Mock };
    studentDocentKoppeling: { create: jest.Mock };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KoppelingService,
        {
          provide: PrismaService,
          useValue: {
            user: { findMany: jest.fn(), findUnique: jest.fn() },
            studentDocentKoppeling: { create: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<KoppelingService>(KoppelingService);
    prisma = module.get(PrismaService);
  });

  it('maakt een koppeling met een bestaande docent', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'DOCENT' });
    prisma.studentDocentKoppeling.create.mockResolvedValue({ id: 'k1' });

    await expect(service.koppelAanDocent('s1', 'd1')).resolves.toEqual({
      id: 'k1',
    });
    expect(prisma.studentDocentKoppeling.create).toHaveBeenCalledWith({
      data: { studentId: 's1', docentId: 'd1' },
    });
  });

  it('gooit NotFoundException als het id niet bestaat', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.koppelAanDocent('s1', 'onbekend')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.studentDocentKoppeling.create).not.toHaveBeenCalled();
  });

  it('weigert te koppelen aan een gebruiker die geen docent is', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'STUDENT' });

    await expect(service.koppelAanDocent('s1', 's2')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.studentDocentKoppeling.create).not.toHaveBeenCalled();
  });

  it('gooit ConflictException bij een dubbele koppeling (P2002)', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'DOCENT' });
    prisma.studentDocentKoppeling.create.mockRejectedValue(prismaFout('P2002'));

    await expect(service.koppelAanDocent('s1', 'd1')).rejects.toThrow(
      ConflictException,
    );
  });

  it('verstopt andere databasefouten niet achter "al gekoppeld"', async () => {
    prisma.user.findUnique.mockResolvedValue({ role: 'DOCENT' });
    const fout = new Error('database onbereikbaar');
    prisma.studentDocentKoppeling.create.mockRejectedValue(fout);

    await expect(service.koppelAanDocent('s1', 'd1')).rejects.toBe(fout);
  });
});
