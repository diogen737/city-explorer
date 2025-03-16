import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http';
import Aura from '@primeng/themes/aura';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,

        options: {
          darkModeSelector: '.tw-dark',
          //   cssLayer: {
          //     name: 'primeng',
          //     order: 'tailwind-base, primeng, tailwind-utilities',
          //   },
        },
      },
    }),
  ],
};
