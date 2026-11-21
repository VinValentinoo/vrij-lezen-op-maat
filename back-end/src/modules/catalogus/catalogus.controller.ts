import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CatalogusService } from './catalogus.service';
import { CatalogusQueryDto } from './dto/catalogus-query.dto';
import { CatalogusPageResponseDto } from './dto/catalogus-response.dto';

@Controller('catalogus')
export class CatalogusController {
  constructor(private readonly catalogusService: CatalogusService) {}

  @Get()
  @ApiOkResponse({ type: CatalogusPageResponseDto })
  async findAll(@Query() query: CatalogusQueryDto) {
    return this.catalogusService.findAll(query);
  }
}
