import { Injectable } from '@angular/core';
import { DoctorsService } from './doctors.service';
import { PatientsService } from './patients.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private appointmentsKey = 'appointments'; // Key for storing appointments in localStorage

  constructor(
    private doctorsService: DoctorsService,
    private patientsService: PatientsService,
    private  notificationService: NotificationService
  ) {}

  // Get all appointments
  getAppointments(): any[] {
    const appointments = localStorage.getItem(this.appointmentsKey);
    return appointments ? JSON.parse(appointments) : [];
  }

  // Get appointments for a specific doctor
  getAppointmentsByDoctor(doctorId: string): any[] {
    return this.getAppointments().filter(appointment => appointment.doctorId === doctorId);
  }

  // Get appointments for a specific patient
  getAppointmentsByPatient(patientId: string): any[] {
    return this.getAppointments().filter(appointment => appointment.patientId === patientId);
  }

  // Create a new appointment with appointmentDate
  createAppointment(newAppointment: any): void {
    // Add appointment ID and status
    const appointmentWithId = {
      id: this.generateId(),
      ...newAppointment,
      status: 'Pending' // Default status for new appointments
    };

    const appointments = this.getAppointments();
    appointments.push(appointmentWithId);
    this.saveAppointments(appointments);
  }

  // Update an existing appointment
  updateAppointment(appointmentId: string, updatedData: any): void {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(app => app.id === appointmentId);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updatedData };
      this.saveAppointments(appointments);
    }
  }

  // Mark an appointment as finished
  markAsFinished(appointmentId: string, doctorName: string, patientId: string, patientName: string): void {
    const appointments = this.getAppointments();
    const appointment = appointments.find(app => app.id === appointmentId);
  
    if (appointment) {
      appointment.status = 'Finished'; 
      this.saveAppointments(appointments); 
      
      // Send notification with doctor's name and patient's name
      this.notificationService.sendNotification(
        `Dr. ${doctorName} has finished check-up for Patient ${patientName} (ID: ${patientId}).`
      );
    } else {
      console.error('Appointment not found!');
    }
  }
  
  

  // Cancel an appointment (delete it from localStorage)
  cancelAppointment(appointmentId: string): void {
    const appointments = this.getAppointments().filter(app => app.id !== appointmentId);
    this.saveAppointments(appointments);
  }

  // Save appointments to localStorage
  private saveAppointments(appointments: any[]): void {
    localStorage.setItem(this.appointmentsKey, JSON.stringify(appointments));
  }

  // Generate unique ID for an appointment
  private generateId(): string {
    return 'A-' + new Date().getTime();  // Unique ID using timestamp
  }

  // Fetch patient name by ID (using PatientsService)
  getPatientName(patientId: string): string {
    const patient = this.patientsService.getPatientById(patientId);
    return patient ? patient.name : 'Unknown Patient'; // Return the full name directly
  }

  // Fetch doctor name by ID (using DoctorsService)
  getDoctorName(doctorId: string): string {
    const doctor = this.doctorsService.getDoctorById(doctorId);
    return doctor ? doctor.fullName : 'Unknown Doctor';
  }

  // Fetch appointment by ID
  getAppointmentById(appointmentId: string): any | undefined {
    return this.getAppointments().find(appointment => appointment.id === appointmentId);
  }
}
