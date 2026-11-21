import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { KoppelingService } from './koppeling.service';
import { KoppelDto } from './dto/koppel.dto';
import { AuthenticatedRequest } from '../auth/types/authenticated-request';

@Controller('koppeling')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class KoppelingController {
  constructor(private readonly koppelingService: KoppelingService) {}

  @Get()
  async getDocenten() {
    return this.koppelingService.getDocenten();
  }

  // Alleen studenten koppelen zichzelf aan een docent (FR6).
  @Post()
  @Roles('STUDENT')
  async koppelAanDocent(
    @Req() req: AuthenticatedRequest,
    @Body() dto: KoppelDto,
  ) {
    return this.koppelingService.koppelAanDocent(req.user.userId, dto.docentId);
  }
}
