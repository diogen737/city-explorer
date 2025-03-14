import { animate, style, transition, trigger } from '@angular/animations';
import { DecimalPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { CityPayload } from '../model';
import { useCollapseState } from '../../composables/collapse-state.composable';
import { CityCardDetailsComponent } from '../city-card-details/city-card-details.component';

@Component({
  selector: 'app-city-card',
  templateUrl: './city-card.component.html',
  imports: [NgClass, DecimalPipe, FaIconComponent, CityCardDetailsComponent],
  animations: [
    trigger('collapse', [
      transition(':enter', [
        style({ height: '0px', opacity: '0' }),
        animate('300ms ease-in-out', style({ height: '*', opacity: '1' })),
      ]),
      transition(':leave', [animate('300ms ease-in-out', style({ height: '0px', opacity: '0' }))]),
    ]),
  ],
})
export class CityCardComponent {
  public readonly city = input.required<CityPayload>();

  public readonly state = useCollapseState();
}
