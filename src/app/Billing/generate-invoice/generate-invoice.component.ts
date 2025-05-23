import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/Services/billing.service';
import { DoctorsService } from 'src/app/Services/doctors.service';
import { PatientsService } from 'src/app/Services/patients.service';

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {
  newInvoice: any = {
    invoiceNumber: '',
    patient: { id: '', name: '', address: '', contact: '' },
    doctor: { id: '', name: '', department: '' },
    services: [],
    totalAmount: 0,
    status: 'Unpaid',
    paymentMethod: 'Cash',
    insuranceDetails: { company: '', policyNumber: '' },
    hospital: { name: '', address: '', contact: '' },
    notes: ''
  };

  serviceDescription = '';
  quantity = 0;
  unitPrice = 0;

  doctors: any[] = [];
  patients: any[] = [];

  hospitalDepartments: string[] = [
    'Cardiology', 'Pediatrics', 'Emergency Medicine', 'Oncology', 'Dermatology', 
    'Intensive Care Medicine', 'General Surgery', 'Gynaecology', 'Laboratory', 'Neurology', 
    'Orthopedics', 'Pharmacy', 'Psychiatry', 'Cardiology', 'Operation Room Circulating Nurse', 
    'Outpatient Department', 'Radiology', 'Anesthesiologist', 'Dietician', 'Gastroenterology', 
    'Gerontology', 'Burn Unit', 'Physical Therapy', 'Surgeon', 'Bed-Related Inpatient Functions', 
    'L&D: Labor and Delivery'
  ];

  selectedDepartment: string = '';

  constructor(
    private billingService: BillingService,
    private doctorsService: DoctorsService,
    private patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  }

  loadDoctors(): void {
    this.doctors = this.doctorsService.getDoctors().map(doctor => ({
      id: doctor.id,
      name: doctor.fullName || 'Unknown Doctor'
    }));
  }

  loadPatients(): void {
    const patientsData = this.patientsService.getPatients();

    if (!Array.isArray(patientsData) || patientsData.length === 0) {
      console.error('Patients data is invalid or empty!');
      return;
    }

    this.patients = patientsData.map(patient => ({
      id: patient.id,
      name: patient.name || 'Unknown Patient',
      address: patient.address || '',
      contact: patient.contact || ''
    }));
  }

  addService(): void {
    if (this.serviceDescription && this.unitPrice > 0) {
      const total = this.quantity * this.unitPrice;
      this.newInvoice.services.push({
        description: this.serviceDescription,
        quantity: this.quantity,
        unitPrice: this.unitPrice,
        total: total
      });
      this.newInvoice.totalAmount += total;
      this.serviceDescription = '';
      this.quantity = 1;
      this.unitPrice = 0;
    }
  }

  createInvoice(): void {
    const randomString = Math.random().toString(36).substring(2, 8);
    const datePrefix = new Date().toISOString().split('T')[0];
    this.newInvoice.invoiceNumber = `INV-${datePrefix}-${randomString}`;

    this.billingService.createInvoice(this.newInvoice);

    this.newInvoice = {
      invoiceNumber: '',
      patient: { id: '', name: '', address: '', contact: '' },
      doctor: { id: '', name: '', department: '' },
      services: [],
      totalAmount: 0,
      status: 'Unpaid',
      paymentMethod: 'Cash',
      insuranceDetails: { company: '', policyNumber: '' },
      hospital: { name: '', address: '', contact: '' },
      notes: ''
    };
  }

  onPatientChange(): void {
    const selectedPatient = this.patients.find(patient => patient.id === this.newInvoice.patient.id);
    if (selectedPatient) {
      this.newInvoice.patient.name = selectedPatient.name || '';
      this.newInvoice.patient.address = selectedPatient.address || '';
      this.newInvoice.patient.contact = selectedPatient.contact || '';
    }
  }
}
