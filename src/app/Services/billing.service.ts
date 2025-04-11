import { Injectable } from '@angular/core';
import { ReportService } from './report.service'; // Import ReportService

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private invoices: any[] = [];

  constructor(private reportService: ReportService) { // Inject ReportService
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
    return `INV-${year}${this.invoices.length * 112}`;
  }

  // Create a new invoice
  createInvoice(invoice: any) {
    invoice.id = this.invoices.length + 1;
    invoice.invoiceNumber = this.generateInvoiceNumber();
    invoice.invoiceDate = new Date().toISOString().split('T')[0]; // Today's date
    invoice.dueDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // +7 days
    this.invoices.push(invoice);
    this.saveInvoices();

    // Call addRevenue to add the invoice total to the report when a new invoice is created
    this.reportService.addRevenue({
      name: 'Invoice',  // Optional 'name' field for clarity
      category: 'Billing', // Make sure 'category' is valid
      amount: invoice.total,
      date: new Date(),   // Date when the revenue is added
    });
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
    const index = this.invoices.findIndex(invoice => invoice.invoiceNumber === invoiceNumber);
    
    if (index !== -1) {
      this.invoices.splice(index, 1);
      this.saveInvoices();
    } else {
      console.error('Invoice not found:', invoiceNumber);
    }
  }

  // Update an invoice
  updateInvoice(updatedInvoice: any) {
    const index = this.invoices.findIndex(invoice => invoice.invoiceNumber === updatedInvoice.invoiceNumber);
    if (index !== -1) {
      this.invoices[index] = updatedInvoice;
      this.saveInvoices();  // Save the updated invoices list to localStorage
    }
  }

  // Complete payment and add revenue
  completePayment(amount: number, category = 'Billing') {
    this.reportService.addRevenue({
      name: 'Payment',   // Optional 'name' for better clarity
      category, // Ensure 'category' matches the expected type in ReportService
      amount,
      date: new Date(),  // Date when the revenue is added
    });
  }
}
