import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DocentService } from './docent.service';
import { GekoppeldeStudentDto } from './dto/gekoppelde-student.dto';
import { AddLeeslijstItemDto } from '../leeslijst/dto/add-leeslijst-item.dto';
import {
  LeeslijstItemDto,
  ReadingListItemDto,
} from '../leeslijst/dto/leeslijst-response.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// @Auth('DOCENT') = JwtAuthGuard + RolesGuard + @Roles('DOCENT') voor alle routes.
// De RolesGuard leest deze class-level metadata via getAllAndOverride.
@Controller('docent')
@Auth('DOCENT')
export class DocentController {
  constructor(private readonly docentenService: DocentService) {}

  @Get()
  @ApiOkResponse({ type: GekoppeldeStudentDto, isArray: true })
  async getGekoppeldeStudenten(@CurrentUser('userId') docentId: string) {
    return this.docentenService.getGekoppeldeStudenten(docentId);
  }

  @Get(':studentId/leeslijst')
  @ApiOkResponse({ type: LeeslijstItemDto, isArray: true })
  async getStudentenLijst(
    @CurrentUser('userId') docentId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.docentenService.getStudentLeeslijst(docentId, studentId);
  }

  @Post(':studentId/leeslijst')
  @ApiCreatedResponse({ type: ReadingListItemDto })
  async addToStudentLeeslijst(
    @CurrentUser('userId') docentId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() dto: AddLeeslijstItemDto,
  ) {
    return this.docentenService.addToStudentLeeslijst(docentId, studentId, dto);
  }
}
