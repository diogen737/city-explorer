import { Controller, Get, Post, HttpCode, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ContinentService } from '@cities/services/continent.service';
import { CountryService } from '@cities/services/country.service';
import { CityService } from '@cities/services/city.service';
import { LandmarkService } from '@cities/services/landmark.service';

@Controller('cities')
export class CityController {
  constructor(
    private readonly continentService: ContinentService,
    private readonly countryService: CountryService,
    private readonly cityService: CityService,
    private readonly landmarkService: LandmarkService,
  ) {}

  @Get('list')
  async cities(
    @Query('page', new ParseIntPipe(), new DefaultValuePipe(1)) page: number,
    @Query('limit', new ParseIntPipe(), new DefaultValuePipe(10)) limit: number,
    @Query('query') query: string,
  ) {
    // Emulate slow response
    await new Promise((resolve) => setTimeout(resolve, 300));

    return this.cityService.cities({
      skip: (page - 1) * limit,
      take: limit,
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

  // Convenience endpoints to clear and re-populate all data
  // NOTE: for the demo purposes only

  @Post('data-reset')
  @HttpCode(204)
  async createContinent() {
    await this.landmarkService.clear();
    await this.cityService.clear();
    await this.countryService.clear();
    await this.continentService.clear();
  }

  @Post('data-populate')
  @HttpCode(204)
  async createCity() {
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
      const existingCity = await this.cityService.createCity({
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
