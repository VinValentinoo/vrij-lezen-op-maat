import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getProfile(@Req() req: Request) {
        return this.profileService.getProfile((req as any).user.userId);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async upsertProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
        return this.profileService.upsertProfile((req as any).user.userId, dto);
    }
}
