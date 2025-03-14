import { Prisma } from '@prisma/client';

// TODO: can be moved out to the library and combined with the service params used in the controller
// see apps/api/src/app/app.controller.ts
export type CityPayload = Prisma.CityGetPayload<{
  include: {
    landmarks: true;
    country: {
      include: { continent: true };
    };
  };
}>;

export type PaginatedOutputDto<T> = {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
};
