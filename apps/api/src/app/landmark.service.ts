import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Landmark, Prisma } from '@prisma/client';

@Injectable()
export class LandmarkService {
  constructor(private prisma: PrismaService) {}

  async landmark(landmarkWhereUniqueInput: Prisma.LandmarkWhereUniqueInput): Promise<Landmark | null> {
    return this.prisma.landmark.findUnique({ where: landmarkWhereUniqueInput });
  }

  async landmarks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LandmarkWhereUniqueInput;
    where?: Prisma.LandmarkWhereInput;
    orderBy?: Prisma.LandmarkOrderByWithRelationInput;
  }): Promise<Landmark[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.landmark.findMany({ skip, take, cursor, where, orderBy });
  }

  async createLandmark(data: Prisma.LandmarkCreateInput): Promise<Landmark> {
    return this.prisma.landmark.create({ data });
  }

  async updateLandmark(params: {
    where: Prisma.LandmarkWhereUniqueInput;
    data: Prisma.LandmarkUpdateInput;
  }): Promise<Landmark> {
    const { where, data } = params;
    return this.prisma.landmark.update({ data, where });
  }

  async deleteLandmark(where: Prisma.LandmarkWhereUniqueInput): Promise<Landmark> {
    return this.prisma.landmark.delete({ where });
  }

  // Convenience method to clear all landmarks
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.landmark.deleteMany();
  }
}
