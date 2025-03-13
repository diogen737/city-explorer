import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { City, Prisma } from '@prisma/client';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async city(cityWhereUniqueInput: Prisma.CityWhereUniqueInput): Promise<City | null> {
    return this.prisma.city.findUnique({ where: cityWhereUniqueInput });
  }

  async cities<T extends Prisma.CityFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.CityFindManyArgs>) {
    return this.prisma.city.findMany(args);
  }

  async createCity(data: Prisma.CityCreateInput): Promise<City> {
    return this.prisma.city.create({ data });
  }

  async updateCity(params: { where: Prisma.CityWhereUniqueInput; data: Prisma.CityUpdateInput }): Promise<City> {
    const { where, data } = params;
    return this.prisma.city.update({ data, where });
  }

  async deleteCity(where: Prisma.CityWhereUniqueInput): Promise<City> {
    return this.prisma.city.delete({ where });
  }

  // Convenience method to clear all cities
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.city.deleteMany();
  }
}
