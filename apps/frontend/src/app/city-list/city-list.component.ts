import { JsonPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
})
export class CityListComponent {
  public readonly cities = httpResource('/api', {
    defaultValue: [],
  });
}
