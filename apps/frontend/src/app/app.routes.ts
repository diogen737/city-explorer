import { Route } from '@angular/router';
import { CityListComponent } from './city-list/city-list.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: CityListComponent,
  },
];
