import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/Services/billing.service';
import { PatientsService } from 'src/app/Services/patients.service';
import { DoctorsService } from 'src/app/Services/doctors.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  invoices: any[] = [];
  patients: any = {}; 
  doctor: any[] = [];
  selectedInvoice: any = null; 
  userRole: string = ''; 

  constructor(
    private billingService: BillingService,
    private patientsService: PatientsService,
    private doctorsService: DoctorsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPatients(); 
    this.userRole = this.authService.getUserRole();
  }

  loadPatients(): void {
    const patientsData = this.patientsService.getPatients();
    if (!Array.isArray(patientsData) || patientsData.length === 0) {
      console.error('Patients data is invalid or empty!');
      return;
    }
    this.patients = {};
    patientsData.forEach(patient => {
      if (patient.id) {
        this.patients[patient.id] = patient;
      }
    });
    console.log('Loaded Patients:', this.patients);
    this.loadDoctor();  
  }

  loadDoctor(): void {
    const doctorData = this.doctorsService.getDoctors();
    if (!Array.isArray(doctorData) || doctorData.length === 0) {
      console.error('Doctors data is invalid or empty!');
      return;
    }
    this.doctor = doctorData.map(doctor => ({
      id: doctor.id,
      name: doctor.fullName || 'Unknown Doctor',
      specialty: doctor.specialty || 'General'
    }));
    console.log('Loaded Doctors:', this.doctor);
    this.loadInvoices();  
  }

  loadInvoices(): void {
    this.invoices = this.billingService.getInvoices(); 

    this.invoices = this.invoices.map(invoice => {
      const doctor = this.doctor.find(d => d.id === invoice.doctor?.id);

      return {
        ...invoice,
        invoiceCode: invoice.invoiceNumber || `INV-${new Date().getTime()}`,
        patientName: this.patients[invoice.patient?.id]?.name || 'Unknown Patient',
        patientAddress: this.patients[invoice.patient?.id]?.address || 'N/A',
        patientContact: this.patients[invoice.patient?.id]?.contact || 'N/A',
        doctorName: doctor?.name || 'Not Assigned', 
        doctorSpecialty: doctor?.specialty || 'General',
        hospitalName: invoice.hospital?.name || 'General Hospital',
        hospitalAddress: invoice.hospital?.address || '254 Stretford',
        hospitalContact: invoice.hospital?.contact || 'info@generalhospital.com',
        services: invoice.services && invoice.services.length > 0 ? invoice.services : [{ description: 'N/A', total: 0 }],
        totalAmount: invoice.totalAmount || 0,
        paymentMethod: invoice.paymentMethod || 'Cash',
        status: invoice.status || 'Unpaid', 
      };
    });

    console.log('Mapped Invoices:', this.invoices);
  }

  viewInvoice(invoice: any): void {
    this.selectedInvoice = invoice;
    console.log('Selected Invoice:', this.selectedInvoice);
  }

  closeModal(): void {
    this.selectedInvoice = null;
  }

  // Edit the invoice in place
  editInvoice(invoice: any): void {
    // Make the invoice editable by toggling a boolean value
    invoice.isEditing = !invoice.isEditing;
    if (!invoice.isEditing) {
      // If editing is done, save the changes back to the service
      this.billingService.updateInvoice(invoice);
      this.loadInvoices();  // Reload the invoices after saving
    }
  }

  makePayment(invoice: any): void {
    if (invoice.status === 'Paid') {
      alert('This invoice is already paid.');
      return;
    }

    alert(`Redirecting to payment page for invoice ${invoice.invoiceCode}`);
    this.router.navigate([`/payment/${invoice.id}`]);
  }

  deleteInvoice(invoiceNumber: number): void {
    this.billingService.deleteInvoice(invoiceNumber);
    this.loadInvoices();
  }

  updateStatus(id: number, status: 'Paid' | 'Unpaid' | 'Pending'): void {
    this.billingService.updateInvoiceStatus(id, status);
    this.loadInvoices();
  }

  isPaymentDisabled(invoice: any): boolean {
    return invoice.status === 'Paid';
  }

  printInvoice(): void {
    const printContent = document.querySelector('.modal-content');
    if (printContent) {
      const clonedContent = printContent.cloneNode(true) as HTMLElement;
      const buttons = clonedContent.querySelectorAll('button');
      buttons.forEach(button => button.remove());
      const logoElement = document.querySelector('.invoice-logo');
      const logo = logoElement ? logoElement.outerHTML : ''; 

      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow?.document.write('<html><head><title>Invoice</title>');
      printWindow?.document.write('<style>@media print { button { display: none; } }</style>');
      printWindow?.document.write('<style>img { max-width: 100%; height: auto; }</style>');
      printWindow?.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
      printWindow?.document.write('</head><body>');

      if (logo) {
        printWindow?.document.write(`<div class="invoice-header">${logo}</div>`);
      }
      printWindow?.document.write(clonedContent.innerHTML); 
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();  
      printWindow?.print();  
    }
  }
}
