import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'theme';

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeKey, theme);
  }

  getTheme(): string {
    return localStorage.getItem(this.themeKey) || 'light';
  }

  loadTheme(): void {
    const savedTheme = this.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}
