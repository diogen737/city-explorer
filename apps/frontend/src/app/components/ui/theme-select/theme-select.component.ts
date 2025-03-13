import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-select',
  templateUrl: './theme-select.component.html',
  imports: [FaIconComponent],
})
export class ThemeSelectComponent {
  public readonly themeService = inject(ThemeService);
}
