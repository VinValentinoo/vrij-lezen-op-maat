import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { isUniqueConstraintError } from '../../prisma/prisma-errors';
import { AddLeeslijstItemDto } from './dto/add-leeslijst-item.dto';
import { CatalogusService } from '../catalogus/catalogus.service';

@Injectable()
export class LeeslijstService {
  constructor(
    private catalogusService: CatalogusService,
    private prisma: PrismaService,
  ) {}

  async getLeeslijst(userId: string) {
    const items = await this.prisma.readingListItem.findMany({
      where: { userId },
    });

    const catalogusItemIds = items.map((item) => item.catalogusItemId);

    const catalogusItems =
      await this.catalogusService.findByIds(catalogusItemIds);

    return items.map((item) => {
      const catalogusItem = catalogusItems.find(
        (c) => c._id.toString() === item.catalogusItemId,
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
    try {
      return await this.prisma.readingListItem.create({
        data: {
          userId,
          catalogusItemId: dto.catalogusItemId,
        },
      });
    } catch (error) {
      // Alleen een unique-constraint-fout (@@unique([userId, catalogusItemId]))
      // betekent "staat er al in"; andere fouten gooien we gewoon door.
      if (isUniqueConstraintError(error)) {
        throw new ConflictException('Dit boek staat al in je leeslijst.');
      }
      throw error;
    }
  }

  async toggleStatus(userId: string, itemId: string) {
    const item = await this.prisma.readingListItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.userId !== userId)
      throw new NotFoundException('Leeslijst niet gevonden.');

    const nieuweStatus = item.status === 'GELEZEN' ? 'NIET_GELEZEN' : 'GELEZEN';

    return this.prisma.readingListItem.update({
      where: { id: itemId },
      data: { status: nieuweStatus },
    });
  }
}
