import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeeslijstService } from '../leeslijst/leeslijst.service';
import { AddLeeslijstItemDto } from '../leeslijst/dto/add-leeslijst-item.dto';

@Injectable()
export class DocentService {
  constructor(
    private leeslijstService: LeeslijstService,
    private prisma: PrismaService,
  ) {}

  async getGekoppeldeStudenten(docentId: string) {
    // select i.p.v. include: we halen alleen op wat de docent mag en moet zien.
    // Met include werd het volledige User-record (incl. wachtwoordHash)
    // meegestuurd naar de client.
    const koppelingen = await this.prisma.studentDocentKoppeling.findMany({
      where: { docentId },
      select: {
        id: true,
        student: {
          select: {
            id: true,
            naam: true,
            email: true,
            readingProfile: { select: { id: true } },
          },
        },
      },
    });

    // Expliciet mappen naar een publiek model, zodat een toekomstig extra
    // veld nooit per ongeluk in de response belandt.
    return koppelingen
      .filter((k) => k.student.readingProfile)
      .map((k) => ({
        id: k.id,
        user: {
          id: k.student.id,
          naam: k.student.naam,
          email: k.student.email,
        },
      }));
  }

  async getStudentLeeslijst(docentId: string, studentId: string) {
    if (!(await this.isGekoppeld(docentId, studentId))) {
      throw new ForbiddenException('Deze gebruiker is niet aan jou gekoppeld.');
    }
    return this.leeslijstService.getLeeslijst(studentId);
  }

  async addToStudentLeeslijst(
    docentId: string,
    studentId: string,
    dto: AddLeeslijstItemDto,
  ) {
    if (!(await this.isGekoppeld(docentId, studentId))) {
      throw new ForbiddenException('Deze gebruiker is niet aan jou gekoppeld.');
    }
    return this.leeslijstService.addToLeeslijst(studentId, dto);
  }

  private async isGekoppeld(
    docentId: string,
    studentId: string,
  ): Promise<boolean> {
    const koppeling = await this.prisma.studentDocentKoppeling.findUnique({
      where: {
        studentId_docentId: { studentId, docentId },
      },
    });

    return koppeling !== null;
  }
}
