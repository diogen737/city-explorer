import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { Country, Prisma } from '@prisma/client';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  async country(countryWhereUniqueInput: Prisma.CountryWhereUniqueInput): Promise<Country | null> {
    return this.prisma.country.findUnique({ where: countryWhereUniqueInput });
  }

  async createCountry(data: Prisma.CountryCreateInput): Promise<Country> {
    return this.prisma.country.create({ data });
  }

  // Convenience method to clear all countries
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.country.deleteMany();
  }
}
