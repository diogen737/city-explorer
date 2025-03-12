import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ContinentService } from './continent.service';
import { CountryService } from './country.service';
import { CityService } from './city.service';
import { LandmarkService } from './landmark.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ContinentService, CountryService, CityService, LandmarkService, PrismaService],
})
export class AppModule {}
