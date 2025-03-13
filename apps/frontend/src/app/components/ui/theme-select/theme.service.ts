import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { STORAGE_KEY, THEMES, Theme } from './theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _state = signal(this.getInitTheme());
  private readonly document = inject(DOCUMENT);

  public readonly state = this._state.asReadonly();
  public readonly isDark = computed(() => this.state() === 'tw-dark');
  public readonly isLight = computed(() => this.state() === 'tw-light');

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this._state());
      this.document.documentElement.classList.remove(...THEMES);
      this.document.documentElement.classList.add(this._state());
    });
  }

  private getInitTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && THEMES.includes(stored)) {
      return stored;
    }

    return 'tw-dark';
  }

  public toggle() {
    this._state.update((val) => (val === 'tw-dark' ? 'tw-light' : 'tw-dark'));
  }
}
