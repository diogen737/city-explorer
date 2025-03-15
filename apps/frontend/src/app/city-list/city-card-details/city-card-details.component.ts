import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { CityPayload } from '../model';

@Component({
  selector: 'app-city-card-details',
  templateUrl: './city-card-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaIconComponent],
})
export class CityCardDetailsComponent {
  public readonly city = input.required<CityPayload>();

  public readonly mapsLink = computed(() => {
    // https://developers.google.com/maps/documentation/urls/get-started
    return `https://google.com/maps/@?api=1&map_action=map&zoom=12&center=${this.city().latitude},${this.city().longitude}`;
  });
}
