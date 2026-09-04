import { NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        return this.prisma.readingProfile.findUnique({
            where: { userId },
        });
    }

    async upsertProfile(userId: string, dto: UpdateProfileDto) {
        return this.prisma.readingProfile.upsert({
            where: { userId },
            create: {
                userId,
                ...dto,
            },
            update: {
                ...dto,
            },
        });
    }
}