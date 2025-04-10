import { Injectable } from '@angular/core';
import { PatientsService } from './patients.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  private storageKey = 'doctors'; // Key for storing doctors in localStorage
  private scheduleKey = 'doctorSchedules'; // Key for storing doctor schedules in localStorage

  constructor(private patientsService: PatientsService,private notificationService: NotificationService) {}

  // Get all doctors
  getDoctors(): any[] {
    const doctors = localStorage.getItem(this.storageKey);
    return doctors ? JSON.parse(doctors) : [];
  }

  // Get a doctor by ID
  getDoctorById(id: string): any {
    return this.getDoctors().find(doctor => doctor.id === id);
  }

  // Add a new doctor
  addDoctor(doctor: any): void {
    const doctors = this.getDoctors();
    doctor.id = this.generateId();
    doctors.push(doctor);
    this.saveDoctors(doctors);
  }

  // Edit a doctor's details
  editDoctor(id: string, updatedDoctor: any): void {
    const doctors = this.getDoctors();
    const index = doctors.findIndex(doctor => doctor.id === id);
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...updatedDoctor };
      this.saveDoctors(doctors);
    }
  }

  // Delete a doctor
  deleteDoctor(id: string): void {
    const doctors = this.getDoctors().filter(doctor => doctor.id !== id);
    this.saveDoctors(doctors);
    this.deleteDoctorSchedule(id); // Remove doctor's schedule
  }

  // Get a doctor's profile
  getDoctorProfile(id: string): any {
    return this.getDoctorById(id);
  }

  // Save doctors list
  private saveDoctors(doctors: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(doctors));
  }

  // Generate unique ID for a doctor
  private generateId(): string {
    return 'D-' + new Date().getTime();
  }

  // Get schedules for all doctors
  getAllSchedules(): any[] {
    const schedules = localStorage.getItem(this.scheduleKey);
    return schedules ? JSON.parse(schedules) : [];
  }

  // Get a doctor's schedule
  getDoctorSchedule(doctorId: string): any[] {
    return this.getAllSchedules().filter(schedule => schedule.doctorId === doctorId);
  }

  // Add or update a schedule for a doctor
  updateDoctorSchedule(doctorId: string, schedule: any[]): void {
    let schedules = this.getAllSchedules();
    schedules = schedules.filter(s => s.doctorId !== doctorId); // Remove old schedule
    schedule.forEach(slot => slot.doctorId = doctorId); // Assign doctor ID
    schedules.push(...schedule);
    this.saveSchedules(schedules);
  }

  // Remove a doctor's schedule
  deleteDoctorSchedule(doctorId: string): void {
    const schedules = this.getAllSchedules().filter(schedule => schedule.doctorId !== doctorId);
    this.saveSchedules(schedules);
  }

  // Save schedules to localStorage
  private saveSchedules(schedules: any[]): void {
    localStorage.setItem(this.scheduleKey, JSON.stringify(schedules));
  }

  // Fetch patient name from PatientsService
  getPatientName(patientId: string): string {
    const patient = this.patientsService.getPatientById(patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Available';
  }
 
}
