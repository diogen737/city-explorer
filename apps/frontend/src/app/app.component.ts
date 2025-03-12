import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [NxWelcomeComponent, RouterModule],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  private readonly http = inject(HttpClient);

  ngOnInit() {
    this.http.get('/api').subscribe((res) => {
      console.log(res);
    });
  }
}
