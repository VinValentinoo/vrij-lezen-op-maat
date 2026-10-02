import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogusItem } from '../catalogus/schemas/catalogus-item.schema';
import { Model } from 'mongoose';
import { PrismaService } from '../../prisma/prisma.service';
import { ReadingProfile } from '@prisma/client';

@Injectable()
export class AdviesService {
  constructor(
    @InjectModel(CatalogusItem.name)
    private catalogusModel: Model<CatalogusItem>,
    private prisma: PrismaService,
  ) {}

  async getAdvies(userId: string) {
    const readingProfile = await this.prisma.readingProfile.findUnique({
      where: { userId },
    });

    if (!readingProfile) {
      throw new NotFoundException('Leesprofiel niet gevonden.');
    }

    const bestaandeLeeslijst = await this.prisma.readingListItem.findMany({
      where: { userId },
      select: { catalogusItemId: true },
    });
    const uitgeslotenIds = new Set(
      bestaandeLeeslijst.map((item) => item.catalogusItemId),
    );

    const catalogusItems = await this.catalogusModel.find().exec();
    const beschikbareItems = catalogusItems.filter(
      (item) => !uitgeslotenIds.has(item._id.toString()),
    );

    const scoredItems = beschikbareItems.map((item) => ({
      item,
      score: this.calculateScore(readingProfile, item),
    }));

    const top3 = scoredItems.sort((a, b) => b.score - a.score).slice(0, 3);

    return top3.map((i) => ({
      catalogusItems: i.item._id.toString(),
      titel: i.item.titel,
      beschrijving: i.item.beschrijving,
      motivatie: this.buildMotive(readingProfile, i.item),
    }));
  }

  private calculateScore(profile: ReadingProfile, item: CatalogusItem): number {
    let score = 0;

    if (profile.taalniveau === item.taalniveau) score++;
    if (profile.genre === item.genre) score++;
    if (profile.onderwerp === item.onderwerp) score++;
    if (profile.lengte === item.lengte) score++;

    return score;
  }

  private buildMotive(profile: ReadingProfile, item: CatalogusItem): string {
    const matches: string[] = [];

    if (profile.taalniveau === item.taalniveau) matches.push('taalniveau');
    if (profile.genre === item.genre) matches.push('genre');
    if (profile.onderwerp === item.onderwerp) matches.push('onderwerp');
    if (profile.lengte === item.lengte) matches.push('lengte');

    if (matches.length === 0) {
      return 'Een titel om eens buiten je gebruikelijke voorkeuren te proberen.';
    }

    return `Dit boek past bij jouw ${matches.join(', ')}.`;
  }
}
