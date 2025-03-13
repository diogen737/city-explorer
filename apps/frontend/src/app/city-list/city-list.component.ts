import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import { CityPayload } from './model';
import { CityCardComponent } from './city-card/city-card.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CityCardComponent],
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
