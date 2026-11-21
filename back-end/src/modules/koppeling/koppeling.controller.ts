import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { KoppelingService } from './koppeling.service';
import { KoppelDto } from './dto/koppel.dto';
import { DocentDto, KoppelingResponseDto } from './dto/koppeling-response.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('koppeling')
@Auth()
export class KoppelingController {
  constructor(private readonly koppelingService: KoppelingService) {}

  @Get()
  @ApiOkResponse({ type: DocentDto, isArray: true })
  async getDocenten() {
    return this.koppelingService.getDocenten();
  }

  // Alleen studenten koppelen zichzelf aan een docent (FR6). @Roles op de
  // methode zit bovenop de class-level @Auth() (JwtAuthGuard + RolesGuard).
  @Post()
  @Roles('STUDENT')
  @ApiCreatedResponse({ type: KoppelingResponseDto })
  @ApiNotFoundResponse({ description: 'Er is geen docent met dit id' })
  @ApiConflictResponse({ description: 'Je bent al aan deze docent gekoppeld' })
  async koppelAanDocent(
    @CurrentUser('userId') studentId: string,
    @Body() dto: KoppelDto,
  ) {
    return this.koppelingService.koppelAanDocent(studentId, dto.docentId);
  }
}
