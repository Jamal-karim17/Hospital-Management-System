import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { PhamarcyService } from 'src/app/Services/phamarcy.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  userRole: string = 'admin';

  constructor(private pharmacyService: PhamarcyService, private authService: AuthService) {}

  ngOnInit() {
    this.orders = this.pharmacyService.getOrders();
    this.userRole = this.authService.getUserRole(); 
    this.loadOrders();
  }

  viewOrder(order: any): void {
    this.selectedOrder = order;
   
  }
  

  closeModal() {
    this.selectedOrder = null;
    const modal = document.getElementById('orderModal')!;
    modal.style.display = 'none';
  }

  loadOrders() {
    const storedOrders = localStorage.getItem('orders');
    this.orders = storedOrders ? JSON.parse(storedOrders) : [];
  }

  // Generate a unique order code when creating an order
  generateOrderCode() {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);  // Example code: ORD16122938270010
  }

  deleteOrder(id: number): void {
    if (this.userRole === 'admin') { // Ensure only admin can delete
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.filter((order: any) => order.id !== id);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      this.loadOrders(); // Refresh list after deletion
    }
  }

  // Printing functionality remains the same as in your code
  printOrder() {
    const printContents = document.getElementById('printable')!.innerHTML;
    const popupWin = window.open('', '_blank', 'width=600,height=800');
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head><title>Order Print</title></head>
          <body onload="window.print();window.close()">${printContents}</body>
        </html>
      `);
      popupWin.document.close();
    }
  }
}
