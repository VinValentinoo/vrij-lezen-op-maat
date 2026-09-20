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

// NB: modules/auth, modules/profile, modules/advies, modules/catalogus en
// modules/leeslijst zijn hier als lege scaffolds neergezet. Elke module krijgt
// straks zijn eigen controller -> service -> repository laag (zie README).
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
    PrismaModule, AuthModule, ProfileModule, CatalogusModule, AdviesModule, LeeslijstModule, KoppelingModule, DocentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
