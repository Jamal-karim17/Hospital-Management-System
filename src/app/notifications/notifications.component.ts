import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: { id: number; message: string; isRead: boolean }[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // Subscribe to notifications$ to get the updated list of notifications
    this.notificationService.notifications$.subscribe(notifs => {
      console.log("Notifications received:", notifs);  
      this.notifications = notifs; 
    });
  }

  // Mark a notification as read
  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId);
  }

  // Handle the click event on a notification to mark it as read
  onNotificationClick(notificationId: number) {
    this.notificationService.markAsRead(notificationId);
  }
}
