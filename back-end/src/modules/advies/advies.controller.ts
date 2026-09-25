import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdviesService } from './advies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('advies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdviesController {
  constructor(private readonly adviesServce: AdviesService) {}

  @Get()
  async getAdvies(@Req() req: Request) {
    return this.adviesServce.getAdvies((req as any).user.userId);
  }
}
