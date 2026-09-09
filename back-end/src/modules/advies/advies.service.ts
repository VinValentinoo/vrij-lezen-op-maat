import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogusItem } from '../catalogus/schemas/catalogus-item.schema';
import { Model } from 'mongoose';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdviesService {
    constructor(
        @InjectModel(CatalogusItem.name) private catalogusModel: Model<CatalogusItem>,
        private prisma: PrismaService
    ) { }

    async getAdvies(userId: string) {
        const readingProfile = await this.prisma.readingProfile.findUnique({
            where: {
                userId: userId
            }
        });

        if (!readingProfile)
            throw new NotFoundException('Leesprofiel niet gevonden.');

        const catalogusItems = await this.catalogusModel.find().exec();

        const sortedItems = catalogusItems.map((item) => ({
            item,
            score: this.calculateScore(readingProfile, item),
        }));

        const top3 = sortedItems
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        return top3.map((i) => ({
            titel: i.item.titel,
            beschrijving: i.item.beschrijving,
            motivatie: this.buildMotive(readingProfile, i.item),
        }));
    }

    private calculateScore(profile: any, item: CatalogusItem): number {
        let score = 0;

        if (profile.taalniveau === item.taalniveau) score++;
        if (profile.genre === item.genre) score++;
        if (profile.onderwerp === item.onderwerp) score++;
        if (profile.lengte === item.lengte) score++;

        return score;
    }

    private buildMotive(profile: any, item: CatalogusItem): string {
        const matches: string[] = []

        if (profile.taalniveau === item.taalniveau) matches.push('taalniveau');
        if (profile.genre === item.genre) matches.push('genre');
        if (profile.onderwerp === item.onderwerp) matches.push('onderwerp');
        if (profile.lengte === item.lengte) matches.push('lengte');

        if(matches.length === 0 ) {
            return 'Een titel om eens buiten je gebruikelijke voorkeuren te proberen.';
        }

        return `Dit boek past bij jouw ${matches.join(', ')}.`;
    }
}
