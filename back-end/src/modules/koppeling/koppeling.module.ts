import { Module } from '@nestjs/common';
import { KoppelingService } from './koppeling.service';
import { KoppelingController } from './koppeling.controller';

@Module({
  providers: [KoppelingService],
  controllers: [KoppelingController],
})
export class KoppelingModule {}
