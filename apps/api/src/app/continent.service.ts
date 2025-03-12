import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Continent, Prisma } from '@prisma/client';

@Injectable()
export class ContinentService {
  constructor(private prisma: PrismaService) {}

  async continent(continentWhereUniqueInput: Prisma.ContinentWhereUniqueInput): Promise<Continent | null> {
    return this.prisma.continent.findUnique({ where: continentWhereUniqueInput });
  }

  async continents(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ContinentWhereUniqueInput;
    where?: Prisma.ContinentWhereInput;
    orderBy?: Prisma.ContinentOrderByWithRelationInput;
  }): Promise<Continent[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.continent.findMany({ skip, take, cursor, where, orderBy });
  }

  async createContinent(data: Prisma.ContinentCreateInput): Promise<Continent> {
    return this.prisma.continent.create({ data });
  }

  async updateContinent(params: {
    where: Prisma.ContinentWhereUniqueInput;
    data: Prisma.ContinentUpdateInput;
  }): Promise<Continent> {
    const { where, data } = params;
    return this.prisma.continent.update({ data, where });
  }

  async deleteContinent(where: Prisma.ContinentWhereUniqueInput): Promise<Continent> {
    return this.prisma.continent.delete({ where });
  }

  // Convenience method to clear all continents
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.continent.deleteMany();
  }
}
