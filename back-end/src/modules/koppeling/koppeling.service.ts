import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KoppelingService {
  constructor(private prisma: PrismaService) {}

  async getDocenten() {
    return this.prisma.user.findMany({
      where: { role: 'DOCENT' },
      select: { id: true, naam: true, email: true },
    });
  }

  async koppelAanDocent(studentId: string, docentId: string) {
    try {
      return await this.prisma.studentDocentKoppeling.create({
        data: { studentId, docentId },
      });
    } catch {
      throw new ConflictException('Je bent al gekoppeld aan deze docent.');
    }
  }
}
