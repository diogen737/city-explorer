import { Controller, Get, Post, HttpCode } from '@nestjs/common';
import { ContinentService } from './continent.service';
import { CountryService } from './country.service';
import { CityService } from './city.service';
import { LandmarkService } from './landmark.service';
@Controller()
export class AppController {
  constructor(
    private readonly continentService: ContinentService,
    private readonly countryService: CountryService,
    private readonly cityService: CityService,
    private readonly landmarkService: LandmarkService,
  ) {}

  @Get('cities')
  async cities() {
    return this.cityService.cities({
      include: {
        landmarks: true,
        country: {
          include: { continent: true },
        },
      },
      omit: {
        countryId: true,
      },
    });
  }

  @Post('data-reset')
  @HttpCode(204)
  async createContinent() {
    await this.landmarkService.clear();
    await this.cityService.clear();
    await this.countryService.clear();
    await this.continentService.clear();

    // pre-defined data from JSON
    const data = await import('../assets/default-data.json');
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
