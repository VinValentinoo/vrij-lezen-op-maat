import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { KoppelingService } from './koppeling.service';
import { KoppelDto } from './dto/koppel.dto';
import { AuthenticatedRequest } from '../auth/types/authenticated-request';

@Controller('koppeling')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KoppelingController {
  constructor(private readonly koppelingService: KoppelingService) {}

  @Get()
  async getDocenten() {
    return this.koppelingService.getDocenten();
  }

  @Post()
  async koppelAanDocent(@Req() req: AuthenticatedRequest, @Body() dto: KoppelDto) {
    return this.koppelingService.koppelAanDocent(
      req.user.userId,
      dto.docentId,
    );
  }
}
