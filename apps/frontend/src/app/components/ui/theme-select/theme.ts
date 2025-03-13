export const THEMES = ['tw-dark', 'tw-light'] as const;
export type Theme = (typeof THEMES)[number];

export const STORAGE_KEY = 'STORAGE_THEME';
