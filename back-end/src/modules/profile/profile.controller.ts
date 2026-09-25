import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: Request) {
    return this.profileService.getProfile((req as any).user.userId);
  }

  @Put()
  async upsertProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.profileService.upsertProfile((req as any).user.userId, dto);
  }
}
