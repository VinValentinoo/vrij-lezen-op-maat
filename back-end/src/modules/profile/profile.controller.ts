import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ReadingProfileResponseDto } from './dto/reading-profile-response.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('profile')
@Auth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOkResponse({
    type: ReadingProfileResponseDto,
    description: 'Het leesprofiel, of een lege response als er nog geen is',
  })
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Put()
  @ApiOkResponse({ type: ReadingProfileResponseDto })
  async upsertProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.upsertProfile(userId, dto);
  }
}
