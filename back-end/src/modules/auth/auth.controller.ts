import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Post('register')
    @ApiCreatedResponse({ type: RegisterResponseDto})
    async register(@Body() dto: RegisterDto) {
        return this.authService.registerUser(dto);
    }

    @Post('login')
    @ApiCreatedResponse({ type: LoginResponseDto })
    async login(@Body() dto: LoginDto) {
        return this.authService.loginUser(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async me(@Req() req: Request) {
        return (req as any).user;
    }
}
