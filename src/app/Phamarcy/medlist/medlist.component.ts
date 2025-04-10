import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { PhamarcyService } from 'src/app/Services/phamarcy.service';

@Component({
  selector: 'app-medlist',
  templateUrl: './medlist.component.html',
  styleUrls: ['./medlist.component.css']
})
export class MedlistComponent implements OnInit {
  medicines: any[] = [];
  cartItems: any[] = []; 
  showCart: boolean = false; 
  searchQuery = ''; 
  filteredMedicines = this.medicines; 
  userRole: string = ''; 

  constructor(private pharmacyService: PhamarcyService,private authService:AuthService) {}

  ngOnInit() {
    // Fetch medicines from local storage
    const storedMedicines = localStorage.getItem('medicines');
    if (storedMedicines) {
      this.medicines = JSON.parse(storedMedicines);
      this.filteredMedicines = [...this.medicines];
    }

    // Sync cart items and count from pharmacy service
    this.cartItems = this.pharmacyService.getCartItems();
    this.userRole = this.authService.getUserRole();
  }

  // Add medicine to the cart
  addToCart(medicine: any) {
    this.pharmacyService.addToCart(medicine);  // Add item to cart using the pharmacy service
  }

  // Toggle cart visibility
  toggleCart() {
    this.showCart = !this.showCart;
  }

  // Calculate total amount for the cart
  get totalAmount() {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Order the items in the cart
  orderItems() {
    if (this.cartItems.length > 0) {
      console.log('Order placed:', this.cartItems);
      // You can replace this with actual order processing logic (e.g., API call)
      
      // Clear the cart after placing the order
      this.cartItems = [];
      alert('Order placed successfully!');
    }
  }

  removeFromCart(medicine: any) {
    this.pharmacyService.removeFromCart(medicine);  // Use pharmacy service to remove item from cart
  }

  cancelOrder() {
    this.pharmacyService.cancelOrder();  // Cancel the order using pharmacy service
    alert('Order has been canceled');
  }

  // Filter medicines based on the search query
  filterMedicines() {
    this.filteredMedicines = this.medicines.filter(med => 
      med.brandName.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      med.genericName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  deleteMedicine(medicine: any) {
    // Call the service to delete the medicine
    this.pharmacyService.deleteMedicine(medicine);
  
    // Fetch the updated list of medicines from the service
    this.medicines = this.pharmacyService.getMedicines();
  
    // Filter the medicines based on the current search query
    this.filteredMedicines = this.filterMedicinesList(this.searchQuery);
  }

  filterMedicinesList(query: string) {
    return this.medicines.filter(med => 
      med.genericName.toLowerCase().includes(query.toLowerCase()) || 
      med.brandName.toLowerCase().includes(query.toLowerCase())
    );
  }
}
