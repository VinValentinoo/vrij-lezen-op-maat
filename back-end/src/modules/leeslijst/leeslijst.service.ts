import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddLeeslijstItemDto } from './dto/add-leeslijst-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogusItem } from '../catalogus/schemas/catalogus-item.schema';
import { Model } from 'mongoose';

@Injectable()
export class LeeslijstService {
    constructor(
        @InjectModel(CatalogusItem.name) private catalogusModel: Model<CatalogusItem>,
        private prisma: PrismaService
    ) { }

    async getLeeslijst(userId: string) {
        const items = await this.prisma.readingListItem.findMany({
            where: { userId },
        });

        const catalogusItemIds = items.map((item) => item.catalogusItemId);

        const catalogusItems = await this.catalogusModel
            .find({ _id: { $in: catalogusItemIds } })
            .exec();

        return items.map((item) => {
            const catalogusItem = catalogusItems.find(
                (c) => c._id.toString() === item.catalogusItemId
            );

            return {
                id: item.id,
                status: item.status,
                titel: catalogusItem?.titel,
                beschrijving: catalogusItem?.beschrijving,
            };
        });
    }

    async addToLeeslijst(userId: string, dto: AddLeeslijstItemDto) {
        return this.prisma.readingListItem.create({
            data: {
                userId,
                catalogusItemId: dto.catalogusItemId
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
            where: { id: itemId },
            data: { status: nieuweStatus }
        });
    }
}
