import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { Continent, Prisma } from '@prisma/client';

@Injectable()
export class ContinentService {
  constructor(private prisma: PrismaService) {}

  async continent(continentWhereUniqueInput: Prisma.ContinentWhereUniqueInput): Promise<Continent | null> {
    return this.prisma.continent.findUnique({ where: continentWhereUniqueInput });
  }

  async createContinent(data: Prisma.ContinentCreateInput): Promise<Continent> {
    return this.prisma.continent.create({ data });
  }

  // Convenience method to clear all continents
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.continent.deleteMany();
  }
}
