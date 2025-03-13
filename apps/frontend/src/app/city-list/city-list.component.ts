import { JsonPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { City, Prisma } from '@prisma/client';
import { tap } from 'rxjs';

// TODO: can be moved out to the library and combined with the service params used in the controller
// see apps/api/src/app/app.controller.ts
type CityPayload = Prisma.CityGetPayload<{
  include: {
    landmarks: true;
    country: {
      include: { continent: true };
    };
  };
}>;

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class CityListComponent {
  private readonly http = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);

  public readonly cities = httpResource<CityPayload[]>('/api/cities', {
    defaultValue: [],
  });

  resetData() {
    this.http
      .post('/api/data-reset', {})
      .pipe(
        tap(() => this.cities.reload()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
