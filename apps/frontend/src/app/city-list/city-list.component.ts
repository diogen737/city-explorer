import { JsonPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
})
export class CityListComponent {
  private readonly http = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);

  public readonly cities = httpResource('/api/cities', {
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
