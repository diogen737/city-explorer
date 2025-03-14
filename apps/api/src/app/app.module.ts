import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { PrismaService } from '@common/services/prisma.service';
import { CityController } from '@cities/controllers/city.controller';
import { ContinentService } from '@cities/services/continent.service';
import { CountryService } from '@cities/services/country.service';
import { CityService } from '@cities/services/city.service';
import { LandmarkService } from '@cities/services/landmark.service';

@Module({
  imports: [],
  controllers: [AppController, CityController],
  providers: [PrismaService, ContinentService, CountryService, CityService, LandmarkService],
})
export class AppModule {}
