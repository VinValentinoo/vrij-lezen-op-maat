import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CatalogusItem,
  CatalogusItemSchema,
} from './schemas/catalogus-item.schema';
import { CatalogusService } from './catalogus.service';
import { CatalogusController } from './catalogus.controller';

// CatalogusModule is de enige eigenaar van het Mongoose-schema. Andere modules
// (advies, leeslijst) importeren deze module en gebruiken CatalogusService,
// zodat de opslagkeuze (Mongo) op één plek verborgen blijft.
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CatalogusItem.name, schema: CatalogusItemSchema },
    ]),
  ],
  providers: [CatalogusService],
  controllers: [CatalogusController],
  exports: [CatalogusService],
})
export class CatalogusModule {}
