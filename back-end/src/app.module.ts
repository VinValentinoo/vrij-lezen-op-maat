import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogusModule } from './modules/catalogus/catalogus.module';
import { AdviesModule } from './modules/advies/advies.module';
import { LeeslijstModule } from './modules/leeslijst/leeslijst.module';
import { KoppelingModule } from './modules/koppeling/koppeling.module';
import { DocentModule } from './modules/docent/docent.module';

// Elke feature is een eigen NestJS-module met controller -> service. Services
// praten rechtstreeks met de ORM (PrismaService voor Postgres, CatalogusService
// voor de Mongo-catalogus). Een aparte repository-laag is bewust weggelaten: zie
// .docs/AFWIJKINGEN.md.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    CatalogusModule,
    AdviesModule,
    LeeslijstModule,
    KoppelingModule,
    DocentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
