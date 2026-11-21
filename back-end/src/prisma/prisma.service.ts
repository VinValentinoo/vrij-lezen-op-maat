import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Eén gedeelde PrismaClient als NestJS-provider (het aanbevolen patroon uit de
// NestJS/Prisma-documentatie). Services injecteren deze via dependency injection;
// PrismaModule is @Global, dus niet elke module hoeft hem te importeren.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
