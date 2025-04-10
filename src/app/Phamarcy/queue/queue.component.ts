import { Component, OnInit } from '@angular/core';
import { QueueService } from 'src/app/Services/queue.service';
import { PatientsService } from 'src/app/Services/patients.service'; // Import PatientsService

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

  constructor(
    private queueService: QueueService,
    private patientsService: PatientsService // Inject PatientsService
  ) {}

  ngOnInit(): void {
    this.patients = this.patientsService.getPatients(); // Get the list of patients from PatientsService
    this.updateQueueList();
  }

  // Generate a queue number for a selected patient
  generateQueue(): void {
    if (this.selectedPatientId) {
      const patient = this.patients.find(p => p.id === this.selectedPatientId);
      if (patient) {
        const queueNumber = this.queueService.generateQueueNumber(patient.name);
        alert(`Queue number for ${patient.name}: ${queueNumber}`);
        this.selectedPatientId = null;
        this.updateQueueList();
      }
    } else {
      alert('Please select a patient.');
    }
  }
  

  // Update the queue list
  updateQueueList(): void {
    this.queueList = this.queueService.getQueueList();
  }

  // Update the status of a patient (e.g., from 'Waiting' to 'Serving')
  updateStatus(queueNumber: number, status: string): void {
    this.queueService.updateStatus(queueNumber, status);
    this.updateQueueList();
  }

  // Remove a patient from the queue
  removeFromQueue(queueNumber: number): void {
    this.queueService.removeFromQueue(queueNumber);
    this.updateQueueList();
  }

  // Handle patient selection from dropdown
  onPatientSelected(): void {
    this.selectedPatient = this.patients.find(p => p.id === this.selectedPatientId);
  }
}
