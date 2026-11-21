import { Module } from '@nestjs/common';
import { LeeslijstController } from './leeslijst.controller';
import { LeeslijstService } from './leeslijst.service';
import { CatalogusModule } from '../catalogus/catalogus.module';

@Module({
  imports: [CatalogusModule],
  controllers: [LeeslijstController],
  providers: [LeeslijstService],
  exports: [LeeslijstService],
})
export class LeeslijstModule {}
