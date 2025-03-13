import { signal } from '@angular/core';

export function useCollapseState() {
  const state = signal<'expanded' | 'collapsed'>('collapsed');

  const toggle = () => {
    state.update((state) => (state === 'expanded' ? 'collapsed' : 'expanded'));
  };

  return { state, toggle };
}
