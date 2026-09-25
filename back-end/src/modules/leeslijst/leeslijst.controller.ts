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
import { AuthenticatedRequest } from '../auth/types/authenticated-request';

@Controller('leeslijst')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeeslijstController {
  constructor(private readonly leeslijstService: LeeslijstService) {}

  @Get()
  async getLeeslijst(@Req() req: AuthenticatedRequest) {
    return this.leeslijstService.getLeeslijst(req.user.userId);
  }

  @Post()
  async addToLeeslijst(@Req() req: AuthenticatedRequest, @Body() dto: AddLeeslijstItemDto) {
    return this.leeslijstService.addToLeeslijst(req.user.userId, dto);
  }

  @Patch(':id/toggle')
  async toggleStatus(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leeslijstService.toggleStatus(req.user.userId, id);
  }
}
