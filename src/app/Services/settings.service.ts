import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsKey = 'appSettings';

  constructor(private notificationService: NotificationService) {}

  getSettings(): any {
    const settings = localStorage.getItem(this.settingsKey);
    return settings ? JSON.parse(settings) : this.getDefaultSettings();
  }

  updateSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
  }

  private getDefaultSettings() {
    return {
      theme: 'light',
      notificationsEnabled: true,
      appointmentDuration: 30,
      defaultCurrency: 'USD',
      billingOptions: 'Prepaid',
      workingHours: { start: '08:00', end: '17:00' },
      hospitalLocation: ''
    };
  }

  toggleNotifications() {
    const settings = this.getSettings(); // Get current settings
    this.notificationService.toggleNotifications(settings.notificationsEnabled);
  }
}
