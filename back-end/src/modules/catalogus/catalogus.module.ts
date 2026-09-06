import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogusItem, CatalogusItemSchema } from './schemas/catalogus-item.schema';
import { CatalogusService } from './catalogus.service';
import { CatalogusController } from './catalogus.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CatalogusItem.name, schema: CatalogusItemSchema },
        ]),
    ],
    providers: [CatalogusService],
    controllers: [CatalogusController],
})
export class CatalogusModule { }
