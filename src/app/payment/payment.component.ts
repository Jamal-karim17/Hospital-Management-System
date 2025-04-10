import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { BillingService } from 'src/app/Services/billing.service';
import { PatientsService } from '../Services/patients.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentMethod: string = '';
  invoiceId: number | null = null;
  invoice: any = null;
  showBankDetails: boolean = false;
  showMpesaDetails: boolean = false;
  showInsuranceDetails: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private billingService: BillingService,
    private router: Router,
    private patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    // Retrieve and validate invoice ID
    const idParam = this.route.snapshot.paramMap.get('id');
    this.invoiceId = idParam ? Number(idParam) : null;

    // Initialize the form to avoid undefined issues
    this.initializeForm();

    // Fetch invoice details if ID is valid
    if (this.invoiceId && !isNaN(this.invoiceId)) {
      this.loadInvoiceDetails();
    } else {
      console.error('Invalid or missing Invoice ID.');
      alert('Invalid Invoice! Redirecting to invoice list.');
      this.router.navigate(['/invoice-list']);
    }

    // Watch for changes in payment method
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.paymentMethod = value;
      this.updatePaymentFields(value);
    });
  }

  // Initialize form with default values
  initializeForm(): void {
    this.paymentForm = this.fb.group({
      patientName: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required],
      accountFrom: [''],
      accountTo: [''],
      mpesaNumber: [''],
      paybillOrTillNumber: [''],
      insuranceName: [''],
      policyNumber: [''],
      membershipId: [''],
      nationalIdOrPassport: ['']
    });
  }

  // Load invoice details from BillingService
  // Load invoice details from BillingService
loadInvoiceDetails(): void {
  try {
    const invoices = this.billingService.getInvoices();
    this.invoice = invoices.find(inv => inv.id === this.invoiceId);

    if (this.invoice) {
      // Fetch the patient details from PatientsService
      const patient = this.patientsService.getPatientById(this.invoice.patient.id);

      if (patient) {
        this.paymentForm.patchValue({
          patientName: patient.name || 'Unknown',
          amount: this.invoice.totalAmount || 0
        });
      } else {
        console.warn(`Patient ID ${this.invoice.patient.id} not found.`);
        alert('Patient not found! Redirecting to invoice list.');
        this.router.navigate(['/invoice-list']);
      }
    } else {
      console.warn(`Invoice ID ${this.invoiceId} not found.`);
      alert('Invoice not found! Redirecting to invoice list.');
      this.router.navigate(['/invoice-list']);
    }
  } catch (error) {
    console.error('Error fetching invoice:', error);
    alert('Error retrieving invoice details. Please try again later.');
    this.router.navigate(['/invoice-list']);
  }
}


  // Toggle specific fields based on payment method
  updatePaymentFields(paymentMethod: string): void {
    this.showBankDetails = paymentMethod === 'bankTransfer';
    this.showMpesaDetails = paymentMethod === 'mpesa';
    this.showInsuranceDetails = paymentMethod === 'insurance';
  }

  // Format currency value
  formatAmount(amount: number | null): string {
    return amount !== null ? new CurrencyPipe('en-US').transform(amount, 'USD', 'symbol') || '' : '';
  }

  // Handle form submission
  onSubmit(): void {
    if (this.paymentForm.valid && this.invoice) {
      console.log('Processing Payment:', this.paymentForm.value);

      // Update invoice status to "Paid"
      this.billingService.updateInvoiceStatus(this.invoice.id, 'Paid');

      alert(`Payment Successful for Invoice #${this.invoice.invoiceNumber}`);

      // Redirect to invoice list
      this.router.navigate(['/invoice-list']);
    } else {
      console.log('Form is invalid');
      alert('Please complete all required fields before submitting.');
    }
  }
}
