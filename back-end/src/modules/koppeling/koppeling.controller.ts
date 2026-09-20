import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { KoppelingService } from './koppeling.service';
import { KoppelDto } from './dto/koppel.dto';

@Controller('koppeling')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KoppelingController {
    constructor(private readonly koppelingService: KoppelingService) {}

    @Get()
    async getDocenten(@Req() req: Request) {
        return this.koppelingService.getDocenten();
    }

    @Post()
    async koppelAanDocent(@Req() req: Request, @Body() dto: KoppelDto) {
        return this.koppelingService.koppelAanDocent((req as any).user.userId, dto.docentId);
    }
}
