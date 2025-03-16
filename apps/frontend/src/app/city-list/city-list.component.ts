import { httpResource } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, resource, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SelectModule } from 'primeng/select';
import { debounceTime } from 'rxjs';

import { CityPayload, PaginatedOutputDto } from './model';
import { CityCardComponent } from './city-card/city-card.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CityCardComponent, FaIconComponent, FormsModule, SelectModule],
})
export class CityListComponent {
  public readonly SORT_OPTIONS = [
    { name: 'Name A-Z', icon: ['fas', 'arrow-down-short-wide'], value: 'name:asc' },
    { name: 'Name Z-A', icon: ['fas', 'arrow-down-wide-short'], value: 'name:desc' },
    { name: 'Population: Low-High', icon: ['fas', 'arrow-down-short-wide'], value: 'population:asc' },
    { name: 'Population: High-Low', icon: ['fas', 'arrow-down-wide-short'], value: 'population:desc' },
  ];

  private readonly page = signal(1);
  private readonly limit = signal(3);
  public readonly query = signal('');
  private readonly queryDebounced = toSignal(toObservable(this.query).pipe(debounceTime(300)), { initialValue: '' });

  public readonly sortOption = signal(this.SORT_OPTIONS[0].value);

  public readonly citiesResource = httpResource<PaginatedOutputDto<CityPayload>>(() => ({
    url: '/api/cities/list',
    params: {
      page: this.page(),
      limit: this.limit(),
      query: this.queryDebounced(),
      sort: this.sortOption(),
    },
  }));

  private readonly resetResourceState = signal<'idle' | 'ready'>('idle');
  public readonly resetResource = resource({
    request: () => (this.resetResourceState() === 'idle' ? undefined : 1),
    loader: () => fetch('/api/cities/data-reset', { method: 'POST' }).then(() => this.resetResourceState.set('idle')),
  });

  private readonly populateResourceState = signal<'idle' | 'ready'>('idle');
  public readonly populateResource = resource({
    request: () => (this.populateResourceState() === 'idle' ? undefined : 1),
    loader: () =>
      fetch('/api/cities/data-populate', { method: 'POST' }).then(() => this.populateResourceState.set('idle')),
  });

  public readonly cities = computed(() => this.citiesResource.value()?.data ?? []);
  public readonly metaPrev = computed(() => this.citiesResource.value()?.meta.prev ?? null);
  public readonly metaNext = computed(() => this.citiesResource.value()?.meta.next ?? null);
  public readonly lastPage = computed(() => this.citiesResource.value()?.meta.lastPage ?? 0);
  public readonly showPagination = computed(() => this.citiesResource.isLoading() || this.lastPage() > 1);
  public readonly disableFilters = computed(
    () => !this.citiesResource.isLoading() && !this.queryDebounced() && this.lastPage() < 1,
  );

  public readonly loading = computed(
    () => this.citiesResource.isLoading() || this.resetResource.isLoading() || this.populateResource.isLoading(),
  );

  public readonly error = computed(
    () => this.citiesResource.error() || this.resetResource.error() || this.populateResource.error(),
  );

  nextPage() {
    this.page.update((page) => page + 1);
  }

  prevPage() {
    this.page.update((page) => page - 1);
  }

  clearData() {
    this.resetResourceState.set('ready');
  }

  populateData() {
    this.populateResourceState.set('ready');
  }
}
