import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LeeslijstService } from './leeslijst.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddLeeslijstItemDto } from './dto/add-leeslijst-item.dto';

@Controller('leeslijst')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeeslijstController {
  constructor(private readonly leeslijstService: LeeslijstService) {}

  @Get()
  async getLeeslijst(@Req() req: Request) {
    return this.leeslijstService.getLeeslijst((req as any).user.userId);
  }

  @Post()
  async addToLeeslijst(@Req() req: Request, @Body() dto: AddLeeslijstItemDto) {
    return this.leeslijstService.addToLeeslijst((req as any).user.userId, dto);
  }

  @Patch(':id/toggle')
  async toggleStatus(@Req() req: Request, @Param('id') id: string) {
    return this.leeslijstService.toggleStatus((req as any).user.userId, id);
  }
}
