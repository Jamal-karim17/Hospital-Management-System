import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/Services/queue.service';
import { PatientsService } from 'src/app/Services/patients.service';
import { NotificationService } from 'src/app/Services/notification.service'; // Inject NotificationService

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit {
  selectedPatientId: number | null = null;
  selectedPatient: any = null;
  queueList: { number: number; patientName: string; status: string; time?: string }[] = [];
  patients: any[] = [];
  selectedDepartment: string = 'Pharmacy'; // Default department
 // List of departments
 departments: string[] = [
  'Pharmacy', 
  'ICU', 
  'Emergency', 
  'Private Ward', 
  'Cardiology', 
  'Pediatrics', 
  'Emergency Medicine', 
  'Oncology', 
  'Dermatology', 
  'Intensive Care Medicine', 
  'General Surgery', 
  'Gynaecology', 
  'Laboratory', 
  'Neurology', 
  'Orthopedics', 
  'Pharmacy', 
  'Psychiatry', 
  'Cardiology', 
  'Operation Room Circulating Nurse', 
  'Outpatient Department', 
  'Radiology', 
  'Anesthesiologist', 
  'Dietician', 
  'Gastroenterology', 
  'Gerontology', 
  'Burn Unit', 
  'Physical Therapy', 
  'Surgeon', 
  'Bed-Related Inpatient Functions', 
  'L&D: Labor and Delivery'
];
 
  constructor(
    private queueService: QueueService,
    private patientsService: PatientsService,
    private notificationService: NotificationService // Inject NotificationService
  ) {}

  ngOnInit(): void {
    this.patients = this.patientsService.getPatients(); // Get the list of patients from PatientsService
    this.updateQueueList(); // Load the queue for the default department
  }

  // Generate a queue number for a selected patient
  generateQueue(): void {
    if (this.selectedPatientId) {
      const patient = this.patients.find(p => p.id === this.selectedPatientId);
      if (patient) {
        const queueNumber = this.queueService.generateQueueNumber(this.selectedDepartment, patient.name);
        alert(`Queue number for ${patient.name}: ${queueNumber}`);
        // Send the notification with department information
        this.notificationService.notifyQueueGeneration(patient.name, queueNumber, this.selectedDepartment);
        this.selectedPatientId = null;
        this.updateQueueList();
      }
    } else {
      alert('Please select a patient.');
    }
  }
  // Update the queue list based on the selected department
  updateQueueList(): void {
    this.queueList = this.queueService.getQueueList(this.selectedDepartment); // Pass selectedDepartment
  }

  // Update the status of a patient (e.g., from 'Waiting' to 'Serving')
  updateStatus(queueNumber: number, status: string): void {
    const patient = this.queueList.find(item => item.number === queueNumber);
    if (patient) {
      this.queueService.updateStatus(this.selectedDepartment, queueNumber, status);
      
      // Send a notification about the status update
      this.notificationService.notifyQueueStatusUpdate(patient.patientName, queueNumber, status);
      
      this.updateQueueList(); // Update queue list after status change
    }
  }

  // Remove a patient from the queue
  removeFromQueue(queueNumber: number): void {
    const patient = this.queueList.find(item => item.number === queueNumber);
    if (patient) {
      this.queueService.removeFromQueue(this.selectedDepartment, queueNumber);
      
      // Send a notification about the patient removal
      this.notificationService.notifyPatientRemoval(patient.patientName, queueNumber);
      
      this.updateQueueList(); // Update queue list after removal
    }
  }

  // Handle patient selection from dropdown
  onPatientSelected(): void {
    this.selectedPatient = this.patients.find(p => p.id === this.selectedPatientId);
  }
}
