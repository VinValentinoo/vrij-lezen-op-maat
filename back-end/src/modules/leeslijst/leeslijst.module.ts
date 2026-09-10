import { Module } from '@nestjs/common';
import { LeeslijstController } from './leeslijst.controller';
import { LeeslijstService } from './leeslijst.service';

@Module({
  controllers: [LeeslijstController],
  providers: [LeeslijstService]
})
export class LeeslijstModule {}
