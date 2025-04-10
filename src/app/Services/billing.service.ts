import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private invoices: any[] = [];


  constructor() {
    this.loadInvoices();
  }

  // Load invoices from localStorage
  private loadInvoices() {
    const storedInvoices = localStorage.getItem('invoices');
    this.invoices = storedInvoices ? JSON.parse(storedInvoices) : [];
  }

  // Save invoices to localStorage
  private saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(this.invoices));
  }

  // Get all invoices
  getInvoices(): any[] {
    return this.invoices;
  }

  // Generate a unique invoice number
  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    return `INV-${year}${this.invoices.length *112}`;
  }

  // Create a new invoice
  createInvoice(invoice: any) {
    invoice.id = this.invoices.length + 1;
    invoice.invoiceNumber = this.generateInvoiceNumber();
    invoice.invoiceDate = new Date().toISOString().split('T')[0]; // Today's date
    invoice.dueDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +7 days
    this.invoices.push(invoice);
    this.saveInvoices();
  }

  // Update invoice status
  updateInvoiceStatus(id: number, status: 'Paid' | 'Unpaid' | 'Pending') {
    const invoice = this.invoices.find((inv) => inv.id === id);
    if (invoice) {
      invoice.status = status;
      this.saveInvoices();
    }
  }

  // Delete an invoice
  deleteInvoice(invoiceNumber: number): void {
    // Find the index of the invoice to delete
    const index = this.invoices.findIndex(invoice => invoice.invoiceNumber === invoiceNumber);
    
    if (index !== -1) {
      // Remove the invoice from the list
      this.invoices.splice(index, 1);
  
      // Optionally, save the updated list to LocalStorage or an API
      localStorage.setItem('invoices', JSON.stringify(this.invoices));
    } else {
      console.error('Invoice not found:', invoiceNumber);
    }
  }
  updateInvoice(updatedInvoice: any) {
    const index = this.invoices.findIndex(invoice => invoice.invoiceNumber === updatedInvoice.invoiceNumber);
    if (index !== -1) {
      this.invoices[index] = updatedInvoice;
      this.saveInvoices();  // Save the updated invoices list to localStorage
    }
  }
}
