import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CatalogusItem } from './schemas/catalogus-item.schema';
import { Model } from 'mongoose';
import { CatalogusQueryDto } from './dto/catalogus-query.dto';

@Injectable()
export class CatalogusService {
  constructor(
    @InjectModel(CatalogusItem.name)
    private catalogusModel: Model<CatalogusItem>,
  ) {}

  async findAll(query: CatalogusQueryDto) {
    // Validatie (>= 1, pageSize <= 500) gebeurt al in CatalogusQueryDto.
    const pageSize = query.pageSize ?? 10;
    const page = query.page ?? 1;

    const filter: Record<string, string> = {};
    if (query.taalniveau) filter.taalniveau = query.taalniveau;
    if (query.genre) filter.genre = query.genre;
    if (query.onderwerp) filter.onderwerp = query.onderwerp;
    if (query.lengte) filter.lengte = query.lengte;

    const [items, total] = await Promise.all([
      this.catalogusModel
        .find(filter)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      this.catalogusModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }
}
