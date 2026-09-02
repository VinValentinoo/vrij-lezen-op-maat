import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

// NB: modules/auth, modules/profile, modules/advies, modules/catalogus en
// modules/leeslijst zijn hier als lege scaffolds neergezet. Elke module krijgt
// straks zijn eigen controller -> service -> repository laag (zie README).
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
