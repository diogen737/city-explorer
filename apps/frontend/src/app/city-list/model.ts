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
