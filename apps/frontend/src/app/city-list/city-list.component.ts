import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { catchError, debounceTime, finalize, of, switchMap, tap } from 'rxjs';

import { CityPayload, PaginatedOutputDto } from './model';
import { CityCardComponent } from './city-card/city-card.component';
@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
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

  private readonly resourceParams = computed(() => ({
    page: this.page(),
    limit: this.limit(),
    query: this.queryDebounced(),
  }));

  private readonly citiesResource = toSignal(
    toObservable(this.resourceParams).pipe(
      tap(() => this.beforeFetch()),
      switchMap((params) => this.http.get<PaginatedOutputDto<CityPayload>>(`/api/cities/list`, { params })),
      catchError((error) => this.handleError(error)),
      tap(() => this.loading.set(false)),
    ),
  );

  public readonly cities = computed(() => this.citiesResource()?.data ?? []);
  public readonly metaPrev = computed(() => this.citiesResource()?.meta.prev ?? null);
  public readonly metaNext = computed(() => this.citiesResource()?.meta.next ?? null);
  public readonly showPagination = computed(() => (this.citiesResource()?.meta.lastPage ?? 0) > 1);

  nextPage() {
    this.page.update((page) => page + 1);
  }

  prevPage() {
    this.page.update((page) => page - 1);
  }

  resetData() {
    this.beforeFetch();
    this.http
      .post('/api/cities/data-reset', {})
      .pipe(
        switchMap(() => this.http.post('/api/cities/data-populate', {})),
        tap(() => this.page.set(1)),
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
