import { DecimalPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { CityPayload } from '../model';
import { useCollapseState } from '../../composables/collapse-state.composable';

@Component({
  selector: 'app-city-card',
  templateUrl: './city-card.component.html',
  imports: [NgClass, DecimalPipe, FaIconComponent],
})
export class CityCardComponent {
  public readonly city = input.required<CityPayload>();

  public readonly state = useCollapseState();
}
