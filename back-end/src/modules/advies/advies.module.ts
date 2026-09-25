import { Module } from '@nestjs/common';
import { AdviesService } from './advies.service';
import { AdviesController } from './advies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CatalogusItem,
  CatalogusItemSchema,
} from '../catalogus/schemas/catalogus-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CatalogusItem.name, schema: CatalogusItemSchema },
    ]),
  ],
  controllers: [AdviesController],
  providers: [AdviesService],
})
export class AdviesModule {}
