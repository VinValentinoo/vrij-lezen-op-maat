import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { CurrentUserDto } from './dto/current-user.dto';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from './types/authenticated-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: RegisterResponseDto })
  async register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseDto })
  async login(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  @Get('me')
  @Auth()
  @ApiOkResponse({ type: CurrentUserDto })
  async me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
