import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/Services/theme.service';
import { SettingsService } from 'src/app/Services/settings.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  selectedTheme: string = 'light';
  notificationsEnabled: boolean = true;
  appointmentDuration: number = 30;
  defaultCurrency: string = 'USD';
  billingOptions: string = 'Prepaid';
  workingHours: { start: string; end: string } = { start: '08:00', end: '17:00' };
  hospitalLocation: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
 


  currencies = ['USD', 'EUR', 'GBP', 'KES', 'INR'];
  billingOptionsList = ['Prepaid', 'Postpaid', 'Insurance'];

  constructor(
    private themeService: ThemeService,
    private settingsService: SettingsService,
   
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const settings = this.settingsService.getSettings();
    if (settings) {
      this.selectedTheme = settings.theme;
      this.notificationsEnabled = settings.notificationsEnabled;
      this.appointmentDuration = settings.appointmentDuration;
      this.defaultCurrency = settings.defaultCurrency;
      this.billingOptions = settings.billingOptions;
      this.workingHours = settings.workingHours;
      this.hospitalLocation = settings.hospitalLocation;
      this.hospitalLocation = 'Kiambu-Nairobi';
    }
  }

  changeTheme(): void {
    this.themeService.setTheme(this.selectedTheme);
    this.settingsService.updateSetting('theme', this.selectedTheme);
  }

  toggleNotifications(): void {
    this.settingsService.updateSetting('notificationsEnabled', this.notificationsEnabled);
  }

  updateAppointmentDuration(): void {
    this.settingsService.updateSetting('appointmentDuration', this.appointmentDuration);
  }

  updateCurrency(): void {
    this.settingsService.updateSetting('defaultCurrency', this.defaultCurrency);
  }

  updateBillingOptions(): void {
    this.settingsService.updateSetting('billingOptions', this.billingOptions);
  }

  updateWorkingHours(): void {
    this.settingsService.updateSetting('workingHours', this.workingHours);
  }

  updateLocation(): void {
    this.settingsService.updateSetting('hospitalLocation', this.hospitalLocation);
  } 
}

