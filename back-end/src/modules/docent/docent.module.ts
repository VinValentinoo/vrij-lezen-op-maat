import { Module } from '@nestjs/common';
import { DocentService } from './docent.service';
import { DocentController } from './docent.controller';
import { LeeslijstService } from '../leeslijst/leeslijst.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogusItem, CatalogusItemSchema } from '../catalogus/schemas/catalogus-item.schema';
import { LeeslijstModule } from '../leeslijst/leeslijst.module';

@Module({
    imports: [
        LeeslijstModule,
    ],
    controllers: [DocentController],
    providers: [DocentService],
})
export class DocentModule { }
