import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { isUniqueConstraintError } from '../../prisma/prisma-errors';

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
    // Het docentId komt van de client: controleer dat het echt een docent is.
    // Zonder deze check kon je jezelf aan elke willekeurige gebruiker koppelen.
    const docent = await this.prisma.user.findUnique({
      where: { id: docentId },
      select: { role: true },
    });
    if (!docent || docent.role !== 'DOCENT') {
      throw new NotFoundException('Docent niet gevonden.');
    }

    try {
      return await this.prisma.studentDocentKoppeling.create({
        data: { studentId, docentId },
      });
    } catch (error) {
      // Alleen de unique-constraint betekent "al gekoppeld"; andere fouten
      // (bv. database down) mogen niet als zo'n melding verstopt worden.
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Je bent al gekoppeld aan deze docent.');
      }
      throw error;
    }
  }
}
