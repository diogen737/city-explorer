import { HttpClient, httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { catchError, debounceTime, finalize, of, tap } from 'rxjs';

import { CityPayload, PaginatedOutputDto } from './model';
import { CityCardComponent } from './city-card/city-card.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CityCardComponent, FaIconComponent, FormsModule],
})
export class CityListComponent {
  private readonly http = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly page = signal(1);
  private readonly limit = signal(3);
  public readonly loading = signal(false);
  public readonly error = signal<string | null>(null);
  public readonly query = signal('');

  private readonly queryDebounced = toSignal(toObservable(this.query).pipe(debounceTime(300)), { initialValue: '' });

  public readonly citiesResource = httpResource<PaginatedOutputDto<CityPayload>>(() => ({
    url: '/api/cities/list',
    params: {
      page: this.page(),
      limit: this.limit(),
      query: this.queryDebounced(),
    },
  }));

  public readonly cities = computed(() => this.citiesResource.value()?.data ?? []);
  public readonly metaPrev = computed(() => this.citiesResource.value()?.meta.prev ?? null);
  public readonly metaNext = computed(() => this.citiesResource.value()?.meta.next ?? null);
  public readonly lastPage = computed(() => this.citiesResource.value()?.meta.lastPage ?? 0);
  public readonly showPagination = computed(() => this.citiesResource.isLoading() || this.lastPage() > 1);
  public readonly disableFilters = computed(
    () => !this.citiesResource.isLoading() && !this.queryDebounced() && this.lastPage() < 1,
  );

  nextPage() {
    this.page.update((page) => page + 1);
  }

  prevPage() {
    this.page.update((page) => page - 1);
  }

  clearData() {
    this.beforeFetch();
    this.http
      .post('/api/cities/data-reset', {})
      .pipe(
        tap(() => this.citiesResource.reload()),
        catchError((error) => this.handleError(error)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  populateData() {
    this.beforeFetch();
    this.http
      .post('/api/cities/data-populate', {})
      .pipe(
        tap(() => this.citiesResource.reload()),
        catchError((error) => this.handleError(error)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  private handleError(error: Error) {
    this.error.set(error.message);
    return of(null);
  }

  private beforeFetch() {
    this.loading.set(true);
    this.error.set(null);
  }
}
