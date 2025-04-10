import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../Services/notification.service';
import { PhamarcyService } from '../Services/phamarcy.service';  // Import pharmacy service

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedInUser: any;
  notifications: { id: number; message: string; isRead: boolean }[] = [];
  unreadCount: number = 0;
  cartCount: number = 0;  // Store current cart count
  showCart: boolean = false;
  cartItems: any[] = [];  // Initialize cartItems in Navbar

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private pharmacyService: PhamarcyService  // Inject pharmacy service
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.getLoggedInUser();

    // Subscribe to notifications and update unread count dynamically
    this.notificationService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.unreadCount = notifs.filter(notif => !notif.isRead).length;
    });

    // Subscribe to cart count and items from PharmacyService
    this.pharmacyService.getCartCount().subscribe(count => {
      this.cartCount = count;  // Update cart count when it changes
    });

    // Initialize cartItems with data from pharmacyService (if any)
    this.cartItems = this.pharmacyService.getCartItems();
  }

  isLoggedIn(): boolean {
    return this.authService.getAuthStatus();
  }

  getLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('auth') || '{}');
    return user ? user : {};
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId);
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  get totalAmount() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  removeFromCart(item: any) {
    this.pharmacyService.removeFromCart(item);  // Use pharmacy service to remove item from cart
  }

  orderItems() {
    this.pharmacyService.placeOrder();  // Place the order using the pharmacy service
    alert('Order placed successfully!');
  }

  cancelOrder() {
    this.pharmacyService.cancelOrder();  // Cancel the order using pharmacy service
    alert('Order has been canceled');
  }

  // Method to add an item to the cart and update the cart count
  addToCart(medicine: any) {
    this.pharmacyService.addToCart(medicine);  // Add item to cart using the pharmacy service
  }
}
