import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/services/prisma.service';
import { Landmark, Prisma } from '@prisma/client';

@Injectable()
export class LandmarkService {
  constructor(private prisma: PrismaService) {}

  async landmark(landmarkWhereUniqueInput: Prisma.LandmarkWhereUniqueInput): Promise<Landmark | null> {
    return this.prisma.landmark.findUnique({ where: landmarkWhereUniqueInput });
  }

  async createLandmark(data: Prisma.LandmarkCreateInput): Promise<Landmark> {
    return this.prisma.landmark.create({ data });
  }

  // Convenience method to clear all landmarks
  // NOTE: This is not a good practice, but it's only for the demo purposes
  async clear() {
    return this.prisma.landmark.deleteMany();
  }
}
