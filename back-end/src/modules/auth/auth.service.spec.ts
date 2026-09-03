import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('maakt een nieuwe gebruiker aan als het e-mailadres nog niet bestaat', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@test.nl',
      naam: 'Test',
      role: 'STUDENT',
      wachtwoordHash: 'gehashte-waarde',
    });

    const result = await service.registerUser({
      email: 'test@test.nl',
      password: 'wachtwoord123',
      name: 'Test',
      role: 'STUDENT' as any,
    });

    expect(result.email).toBe('test@test.nl');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('gooit een ConflictException als het e-mailadres al bestaat', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@test.nl',
      naam: 'Test',
      role: 'STUDENT',
      wachtwoordHash: 'iets',
    });

    await expect(
      service.registerUser({
        email: 'test@test.nl',
        password: 'wachtwoord123',
        name: 'Test',
        role: 'STUDENT' as any,
      })
    ).rejects.toThrow(ConflictException);
  });

  it('geeft een token terug bij correcte inloggegevens', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@test.nl',
      naam: 'Test',
      role: 'STUDENT',
      wachtwoordHash: 'gehashte-waarde',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.loginUser({
      email: 'test@test.nl',
      password: 'wachtwoord123',
    });

    expect(result.accessToken).toBe('fake-jwt-token');
  });
});