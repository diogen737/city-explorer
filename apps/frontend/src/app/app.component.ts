import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterModule, HeaderComponent],
})
export class AppComponent {
  private readonly faLibrary = inject(FaIconLibrary);

  constructor() {
    this.faLibrary.addIconPacks(fas);
  }
}
