import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: { id: number; message: string; isRead: boolean }[] = [];
  private notificationsSubject = new BehaviorSubject<{ id: number; message: string; isRead: boolean }[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private notificationId = 0;
  private notificationsEnabled: boolean = true; // Default enabled

  constructor() {
    // Load notifications from localStorage if necessary (Optional)
    this.loadNotifications();
  }

  // Load notifications from localStorage (Optional)
  private loadNotifications() {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications);
      this.notificationsSubject.next([...this.notifications]);
    }
  }

  // Save notifications to localStorage (Optional)
  private saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  // Send a new notification with message
  sendNotification(message: string) {
    const notification = {
      id: this.notificationId++, // Unique ID
      message: message,           // The message string passed in
      isRead: false
    };

    console.log("Sending notification:", notification);  // Log the notification being sent

    // Add new notification to the array
    this.notifications.unshift(notification); // Add it at the beginning
    this.notificationsSubject.next([...this.notifications]); // Notify all subscribers

    // Optionally save to localStorage (if needed)
    this.saveNotifications();
  }
  // Mark a notification as read
  markAsRead(notificationId: number) {
    const notification = this.notifications.find(notif => notif.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notificationsSubject.next([...this.notifications]); // Update the list
      this.saveNotifications(); // Persist updated read status
    }
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(notif => !notif.isRead).length;
  }

  // Toggle notifications ON/OFF from Settings
  toggleNotifications(enabled: boolean) {
    this.notificationsEnabled = enabled;
  }

  // Clear all notifications
  clearNotifications() {
    this.notifications = [];
    this.notificationsSubject.next([...this.notifications]);
    this.saveNotifications(); // Persist cleared notifications
  }
}
