import {
  Controller,
  Get,
  Post,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ContinentService } from '@cities/services/continent.service';
import { CountryService } from '@cities/services/country.service';
import { CityService } from '@cities/services/city.service';
import { LandmarkService } from '@cities/services/landmark.service';
import { SortingParam, SortingParams } from '@common/decorators/sorting-params.decorator';

@Controller('cities')
export class CityController implements OnApplicationBootstrap {
  constructor(
    private readonly continentService: ContinentService,
    private readonly countryService: CountryService,
    private readonly cityService: CityService,
    private readonly landmarkService: LandmarkService,
  ) {}

  @Get('list')
  async cities(
    @Query('page', new ParseIntPipe({ optional: true }), new DefaultValuePipe(1)) page: number,
    @Query('limit', new ParseIntPipe({ optional: true }), new DefaultValuePipe(10)) limit: number,
    @SortingParams(['name', 'population']) sort: SortingParam | null,
    @Query('query', new DefaultValuePipe('')) query: string,
  ) {
    // Emulate slow response
    await new Promise((resolve) => setTimeout(resolve, 300));

    return this.cityService.cities({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sort ? { [sort.property]: sort.direction } : { name: 'asc' },
      where: {
        OR: [{ name: { contains: query } }, { name_native: { contains: query } }],
      },
      include: {
        landmarks: true,
        country: {
          include: { continent: true },
        },
      },
      // save a few bytes
      omit: {
        countryId: true,
      },
    });
  }

  async onApplicationBootstrap() {
    const count = await this.cityService.count();
    if (count > 0) {
      return;
    }
    await this.dataPopulate();
  }

  // Convenience endpoints to clear and re-populate all data
  // NOTE: for the demo purposes only

  @Post('data-reset')
  @HttpCode(204)
  async dataReset() {
    await this.landmarkService.clear();
    await this.cityService.clear();
    await this.countryService.clear();
    await this.continentService.clear();
  }

  @Post('data-populate')
  @HttpCode(204)
  async dataPopulate() {
    const data = await import('../../../assets/default-data.json');
    for (const city of data.cities) {
      const continentName = city.continent;
      let existingContinent = await this.continentService.continent({ name: continentName });
      if (!existingContinent) {
        existingContinent = await this.continentService.createContinent({ name: continentName });
      }

      const countryName = city.country;
      let existingCountry = await this.countryService.country({ name: countryName });
      if (!existingCountry) {
        existingCountry = await this.countryService.createCountry({
          name: countryName,
          continent: { connect: { id: existingContinent.id } },
        });
      }

      const cityName = city.name;
      const existingCity = await this.cityService.create({
        name: cityName,
        name_native: city.name_native,
        population: parseInt(city.population),
        founded: parseInt(city.founded),
        latitude: city.latitude,
        longitude: city.longitude,
        country: { connect: { id: existingCountry.id } },
      });

      for (const landmark of city.landmarks) {
        await this.landmarkService.createLandmark({
          name: landmark,
          city: { connect: { id: existingCity.id } },
        });
      }
    }
  }
}
