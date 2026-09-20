import { Module } from '@nestjs/common';
import { LeeslijstController } from './leeslijst.controller';
import { LeeslijstService } from './leeslijst.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogusItem, CatalogusItemSchema } from '../catalogus/schemas/catalogus-item.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CatalogusItem.name, schema: CatalogusItemSchema },
        ]),
    ],
    controllers: [LeeslijstController],
    providers: [LeeslijstService],
    exports: [LeeslijstService],
})
export class LeeslijstModule {}
