import { Injectable } from '@nestjs/common';
import { City, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

import { PrismaService } from '@common/services/prisma.service';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async city(cityWhereUniqueInput: Prisma.CityWhereUniqueInput): Promise<City | null> {
    return this.prisma.city.findUnique({ where: cityWhereUniqueInput });
  }

  async cities<T extends Prisma.CityFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.CityFindManyArgs>) {
    // NOTE: paginate function doesn't infer the return type from the args, like the findMany function does
    // Possible solution: either improve generic type arguments for the `paginate` function,
    //                    or use the `findMany` and implement the pagination logic manually
    // return this.prisma.city.findMany(args);

    const paginate = createPaginator({ perPage: args.take });
    return paginate<City, Prisma.CityFindManyArgs>(this.prisma.city, args, { page: args.skip / args.take + 1 });
  }

  public async count() {
    return this.prisma.city.count();
  }

  async create(data: Prisma.CityCreateInput): Promise<City> {
    return this.prisma.city.create({ data });
  }

  async delete(where: Prisma.CityWhereUniqueInput): Promise<City> {
    return this.prisma.city.delete({ where });
  }

  // Convenience method to clear all cities
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.city.deleteMany();
  }
}
