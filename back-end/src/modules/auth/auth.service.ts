import { ConflictException, UnauthorizedException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async registerUser(dto: RegisterDto) {
        const existingUser = await this.findUserByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Gebruiker met dit e-mailadres bestaat al');
        }

        const hash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                wachtwoordHash: hash,
                naam: dto.name,
                role: dto.role,
            },
        });

        return {
            message: 'Gebruiker succesvol geregistreerd',
            email: user.email,
            name: user.naam,
            role: user.role,
        };
    }

    async loginUser(dto: LoginDto) {
        const user = await this.findUserByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Wachtwoord of e-mailadres is onjuist');
        }

        const isPassValid = await bcrypt.compare(dto.password, user.wachtwoordHash);

        if (!isPassValid) {
            throw new UnauthorizedException('Wachtwoord of e-mailadres is onjuist');
        }

        const payload = { sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Gebruiker succesvol ingelogd',
            accessToken: token,
        };
    }
}
