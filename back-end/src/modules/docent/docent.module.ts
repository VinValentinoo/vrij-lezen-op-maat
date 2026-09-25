import { Module } from '@nestjs/common';
import { DocentService } from './docent.service';
import { DocentController } from './docent.controller';
import { LeeslijstModule } from '../leeslijst/leeslijst.module';

@Module({
  imports: [LeeslijstModule],
  controllers: [DocentController],
  providers: [DocentService],
})
export class DocentModule {}
