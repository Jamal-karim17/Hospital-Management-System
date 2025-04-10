import { Component, OnInit } from '@angular/core';
import { ThemeService } from './Services/theme.service';
import { NotificationService } from './Services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'health_management';
  notifications: { id: number; message: string; isRead: boolean }[] = []; // Store notifications with read status
  unreadCount: number = 0; // Count unread notifications
  showNotifications: boolean = false; // Toggle notifications dropdown

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {
    this.applyTheme();
  }

  ngOnInit(): void {
    // Subscribe to notification changes
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(notif => !notif.isRead).length; // Count unread messages
    });
  }

  applyTheme(): void {
    const theme = localStorage.getItem('selectedTheme') || 'light';
    this.themeService.setTheme(theme);
  }

  // Trigger a new notification
  triggerNotification(message: string) {
    this.notificationService.sendNotification(message);
  }

  // Toggle notification dropdown
  toggleNotificationDropdown() {
    this.showNotifications = !this.showNotifications;
  }

  // Mark a specific notification as read
  markNotificationAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId);
  }
}
