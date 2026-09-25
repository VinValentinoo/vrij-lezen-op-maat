import { Controller, Get, Query } from '@nestjs/common';
import { CatalogusService } from './catalogus.service';
import { CatalogusQueryDto } from './dto/catalogus-query.dto';

@Controller('catalogus')
export class CatalogusController {
  constructor(private readonly catalogusService: CatalogusService) {}

  @Get()
  async findAll(@Query() query: CatalogusQueryDto) {
    return this.catalogusService.findAll(query);
  }
}
