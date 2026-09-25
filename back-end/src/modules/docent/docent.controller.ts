import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocentService } from './docent.service';
import { AddLeeslijstItemDto } from '../leeslijst/dto/add-leeslijst-item.dto';
import { AuthenticatedRequest } from '../auth/types/authenticated-request';

@Controller('docent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DOCENT')
@ApiBearerAuth()
export class DocentController {
  constructor(private readonly docentenService: DocentService) {}

  @Get()
  async getGekoppeldeStudenten(@Req() req: AuthenticatedRequest) {
    return this.docentenService.getGekoppeldeStudenten(req.user.userId);
  }

  @Get(':studentId/leeslijst')
  async getStudentenLijst(
    @Req() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
  ) {
    return this.docentenService.getStudentLeeslijst(req.user.userId, studentId);
  }

  @Post(':studentId/leeslijst')
  async addToStudentLeeslijst(
    @Req() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
    @Body() dto: AddLeeslijstItemDto,
  ) {
    return this.docentenService.addToStudentLeeslijst(
      req.user.userId,
      studentId,
      dto,
    );
  }
}
