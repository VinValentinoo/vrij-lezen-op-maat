import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeeslijstService {
    constructor(private prisma: PrismaService) {}

    async getLeeslijst(userId: string) {
        return this.prisma.readingListItem.findMany({
            where: {
                userId: userId
            }
        })
    }
}
