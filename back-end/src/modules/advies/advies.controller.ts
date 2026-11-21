import { Controller, Get } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { AdviesService } from './advies.service';
import { AdviesItemDto } from './dto/advies-item.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('advies')
@Auth()
export class AdviesController {
  constructor(private readonly adviesService: AdviesService) {}

  @Get()
  @ApiOkResponse({ type: AdviesItemDto, isArray: true })
  @ApiNotFoundResponse({
    description: 'De gebruiker heeft nog geen leesprofiel',
  })
  async getAdvies(@CurrentUser('userId') userId: string) {
    return this.adviesService.getAdvies(userId);
  }
}
