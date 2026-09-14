import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddLeeslijstItemDto } from './dto/add-leeslijst-item.dto';

@Injectable()
export class LeeslijstService {
    constructor(private prisma: PrismaService) {}

    async getLeeslijst(userId: string) {
        return this.prisma.readingListItem.findMany({
            where: { userId }
        });
    }

    async addToLeeslijst(userId: string, dto: AddLeeslijstItemDto) {
        return this.prisma.readingListItem.create({
            data: {
                userId,
                catalogusItemId: dto.CatalogusItemid
            }
        });
    }

    async toggleStatus(userId: string, itemId: string) {
        const item = await this.prisma.readingListItem.findUnique({
            where: { id: itemId }
        });

        if (!item || item.userId !== userId) 
            throw new NotFoundException('Leeslijst niet gevonden.');

        const nieuweStatus = item.status === 'GELEZEN' ? 'NIET_GELEZEN' : 'GELEZEN';

        return this.prisma.readingListItem.update({
            where: { id: itemId},
            data: { status: nieuweStatus}
        });
    }
}
