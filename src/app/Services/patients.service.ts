import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private storageKey = 'patients';
  private patients: any[] = [];

  constructor( private notificationService: NotificationService) {
  
    const data = localStorage.getItem(this.storageKey);
    this.patients = data ? JSON.parse(data) : [];
  }

  private updateStorage(): void {
    // Persist the updated patients list to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(this.patients));
  }

  getPatients(): any[] {
    
    return this.patients;
  
  }

  getPatientById(id: string): any {
    return this.patients.find((p) => p.id === id);
  }

  addPatient(patient: any): void {
    patient.id = 'P-' + new Date().getTime(); // Generate unique ID
    patient.discharged = 'Active'; // Default status as "Active"

    this.patients.push(patient);
    this.updateStorage();
  }

  updatePatient(updatedPatient: any): void {
    const index = this.patients.findIndex((p) => p.id === updatedPatient.id);
    if (index !== -1) {
      this.patients[index] = updatedPatient;
      this.updateStorage();
    }
  }

  dischargePatient(id: string): void {
    const patient = this.patients.find((p) => p.id === id);
    if (patient) {
      patient.discharged = 'Discharged'; // Change status to "Discharged"
      this.updateStorage();
  
      // Send the notification with the patient's name and a message
      this.notificationService.sendNotification(`${patient.name} has been discharged`); // Formatted message
  
    } else {
      console.error('Patient not found!');
    }
  }
  
  
  

  deletePatient(id: string): void {
    this.patients = this.patients.filter((p) => p.id !== id);
    this.updateStorage();
  }

  getPatientName(id: string): string {
    const patient = this.patients.find((p) => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
  }

  
}
