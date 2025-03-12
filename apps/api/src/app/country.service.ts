import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Continent, Country, Prisma } from '@prisma/client';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  async country(countryWhereUniqueInput: Prisma.CountryWhereUniqueInput): Promise<Country | null> {
    return this.prisma.country.findUnique({ where: countryWhereUniqueInput });
  }

  async countries(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CountryWhereUniqueInput;
    where?: Prisma.CountryWhereInput;
    orderBy?: Prisma.CountryOrderByWithRelationInput;
    include?: Prisma.CountryInclude;
    omit?: Prisma.CountryOmit;
  }): Promise<Country[]> {
    const { skip, take, cursor, where, orderBy, include, omit } = params;
    return this.prisma.country.findMany({ skip, take, cursor, where, orderBy, include, omit });
  }

  async createCountry(data: Prisma.CountryCreateInput): Promise<Country> {
    return this.prisma.country.create({ data });
  }

  async updateCountry(params: {
    where: Prisma.CountryWhereUniqueInput;
    data: Prisma.CountryUpdateInput;
  }): Promise<Country> {
    const { where, data } = params;
    return this.prisma.country.update({ data, where });
  }

  async deleteCountry(where: Prisma.CountryWhereUniqueInput): Promise<Country> {
    return this.prisma.country.delete({ where });
  }

  // Convenience method to clear all countries
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.country.deleteMany();
  }
}
