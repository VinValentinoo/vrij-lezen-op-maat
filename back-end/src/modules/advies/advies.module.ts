import { Module } from '@nestjs/common';
import { AdviesService } from './advies.service';
import { AdviesController } from './advies.controller';
import { CatalogusModule } from '../catalogus/catalogus.module';

@Module({
  imports: [CatalogusModule],
  controllers: [AdviesController],
  providers: [AdviesService],
})
export class AdviesModule {}
