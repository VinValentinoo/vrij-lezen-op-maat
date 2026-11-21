import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LeeslijstService } from './leeslijst.service';
import { AddLeeslijstItemDto } from './dto/add-leeslijst-item.dto';
import {
  LeeslijstItemDto,
  ReadingListItemDto,
} from './dto/leeslijst-response.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('leeslijst')
@Auth()
export class LeeslijstController {
  constructor(private readonly leeslijstService: LeeslijstService) {}

  @Get()
  @ApiOkResponse({ type: LeeslijstItemDto, isArray: true })
  async getLeeslijst(@CurrentUser('userId') userId: string) {
    return this.leeslijstService.getLeeslijst(userId);
  }

  @Post()
  @ApiCreatedResponse({ type: ReadingListItemDto })
  @ApiConflictResponse({ description: 'Dit boek staat al in de leeslijst' })
  async addToLeeslijst(
    @CurrentUser('userId') userId: string,
    @Body() dto: AddLeeslijstItemDto,
  ) {
    return this.leeslijstService.addToLeeslijst(userId, dto);
  }

  @Patch(':id/toggle')
  @ApiOkResponse({ type: ReadingListItemDto })
  @ApiNotFoundResponse({ description: 'Item bestaat niet of is niet van jou' })
  async toggleStatus(
    @CurrentUser('userId') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.leeslijstService.toggleStatus(userId, id);
  }
}
