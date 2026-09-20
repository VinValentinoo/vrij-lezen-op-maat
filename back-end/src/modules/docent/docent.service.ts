import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeeslijstService } from '../leeslijst/leeslijst.service';
import { AddLeeslijstItemDto } from '../leeslijst/dto/add-leeslijst-item.dto';

@Injectable()
export class DocentService {
    constructor(
        private leeslijstService: LeeslijstService,
        private prisma: PrismaService
    ) { }

    async getGekoppeldeStudenten(docentId: string) {
        const koppeling = await this.prisma.studentDocentKoppeling.findMany({
            where: { docentId: docentId },
            include: {
                student: { include: { readingProfile: true } },
            },
        });

        return koppeling
            .filter((k) => k.student.readingProfile)
            .map((k) => ({ id: k.id, user: k.student }));
    }

    async getStudentLeeslijst(docentId: string, studentId: string) {
        if (!(await this.isGekoppeld(docentId, studentId))) {
            throw new ForbiddenException('Deze gebruiker is niet aan jou gekoppeld.')
        }
        return this.leeslijstService.getLeeslijst(studentId);
    }

    async addToStudentLeeslijst(docentId: string, studentId: string, dto: AddLeeslijstItemDto) {
        if (!(await this.isGekoppeld(docentId, studentId))) {
            throw new ForbiddenException('Deze gebruiker is niet aan jou gekoppeld.')
        }
        return this.leeslijstService.addToLeeslijst(studentId, dto);
    }

    private async isGekoppeld(docentId: string, studentId: string): Promise<boolean> {
        const koppeling = await this.prisma.studentDocentKoppeling.findUnique({
            where: {
                studentId_docentId: { studentId, docentId },
            },
        });

        return koppeling !== null;
    }
}
