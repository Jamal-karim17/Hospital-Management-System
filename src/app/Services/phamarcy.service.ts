import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PhamarcyService {
  private medicines: any[] = [];
  private cartItems: any[] = [];
  private cartCountSource = new BehaviorSubject<number>(0);

  constructor() {
    // Initialize cart from localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    this.cartItems = storedCartItems;
    this.cartCountSource.next(this.cartItems.length);
  }

  // Get list of medicines
  getMedicines() {
    const data = localStorage.getItem('medicines');
    this.medicines = data ? JSON.parse(data) : [];
    return this.medicines;
  }

  // Get cart count as observable
  getCartCount() {
    return this.cartCountSource.asObservable();
  }

  // Get cart items
  getCartItems() {
    return this.cartItems;
  }

  // Add item to cart and decrease stock
  addToCart(medicine: any) {
    const medIndex = this.getMedicines().findIndex(
      m => m.genericName === medicine.genericName
    );

    if (medIndex !== -1 && this.medicines[medIndex].stock > 0) {
      const existingItem = this.cartItems.find(
        item => item.genericName === medicine.genericName
      );

      // Decrease stock
      this.medicines[medIndex].stock--;

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({ ...medicine, quantity: 1 });
      }

      this.updateMedicinesLocalStorage();
      this.updateCartLocalStorage();
      this.cartCountSource.next(this.cartItems.length);
    }
  }

  // Remove from cart and return stock
  removeFromCart(item: any) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      const medIndex = this.getMedicines().findIndex(
        m => m.genericName === item.genericName
      );

      // Return quantity to stock
      if (medIndex !== -1) {
        this.medicines[medIndex].stock += item.quantity;
      }

      this.cartItems.splice(index, 1);
      this.updateMedicinesLocalStorage();
      this.updateCartLocalStorage();
      this.cartCountSource.next(this.cartItems.length);
    }
  }

  // Cancel order and restore all stock
  cancelOrder() {
    for (let item of this.cartItems) {
      const medIndex = this.getMedicines().findIndex(
        m => m.genericName === item.genericName
      );

      if (medIndex !== -1) {
        this.medicines[medIndex].stock += item.quantity;
      }
    }

    this.cartItems = [];
    this.updateMedicinesLocalStorage();
    this.updateCartLocalStorage();
    this.cartCountSource.next(0);
  }

  // Add a new medicine without overwriting others
  addMedicine(medicine: any) {
    const storedMeds = localStorage.getItem('medicines');
    this.medicines = storedMeds ? JSON.parse(storedMeds) : [];

    this.medicines.push(medicine);
    this.updateMedicinesLocalStorage();
  }

  // Update medicine list in localStorage
  private updateMedicinesLocalStorage() {
    localStorage.setItem('medicines', JSON.stringify(this.medicines));
  }

  // Update cart in localStorage
  private updateCartLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  // Delete medicine from list
  deleteMedicine(medicine: any) {
    // Find the index of the medicine in the medicines list using genericName
    const index = this.medicines.findIndex(med => med.genericName === medicine.genericName);
    
    if (index !== -1) {
      // Remove the medicine from the in-memory list
      this.medicines.splice(index, 1);
      
      // Update the medicines in localStorage after removal
      this.updateMedicinesLocalStorage();
  
      // Optionally, also update the cart if the deleted medicine is in the cart
      this.cartItems = this.cartItems.filter(item => item.genericName !== medicine.genericName);
      this.updateCartLocalStorage();
    }
  }

  // Place order with unique order code
  placeOrder() {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  
    const order = {
      id: Date.now(),
      orderCode: this.generateOrderCode(),  // Add unique order code
      date: new Date(),
      items: [...this.cartItems],
      total: this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    };
  
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
  
    // Clear the cart after placing the order
    this.cartItems = [];
    this.updateCartLocalStorage();
    this.cartCountSource.next(0);
  }

  // Generate unique order code
  private generateOrderCode() {
    return 'ORD' + Date.now() + Math.floor(Math.random() * 1000); // Example: ORD16122938270010
  }

  // Get list of orders
  getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
}
