import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ThemeSelectComponent } from '../ui/theme-select/theme-select.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [ThemeSelectComponent, FaIconComponent],
})
export class HeaderComponent {}
