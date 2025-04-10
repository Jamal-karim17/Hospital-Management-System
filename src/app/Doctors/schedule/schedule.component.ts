import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute to read query parameters
import { AppointmentsService } from 'src/app/Services/appointments.service';
import { DoctorsService } from 'src/app/Services/doctors.service';
import { PatientsService } from 'src/app/Services/patients.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  doctors: any[] = [];
  patients: any[] = [];
  schedules: any[] = [];
  selectedDoctorId: string = '';
  selectedPatientId: string = '';
  newSlot: string = '';
  appointmentType: string = '';
  notes: string = '';
  appointmentDate: string = '';  // New field to capture the appointment date
  appointmentId: string = '';  // Appointment ID for rescheduling
  currentTime: string = ''; // Current time of the appointment
  currentDate: string = ''; // Current date of the appointment

  appointmentTypes = [
    'General Checkup', 'Consultation', 'Surgery', 'Follow-up', 'Emergency',
    'Therapy Session', 'Vaccination'
  ];

  constructor(
    private appointmentsService: AppointmentsService,
    private doctorsService: DoctorsService,
    private patientsService: PatientsService,
    private activatedRoute: ActivatedRoute  // Inject ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
  
    this.activatedRoute.queryParams.subscribe(params => {
      this.appointmentId = params['appointmentId'];
      this.selectedDoctorId = params['doctorId'];
      this.currentTime = params['currentTime'];
      this.currentDate = params['currentDate'];
  
      // Prefill the appointment details for rescheduling
      this.appointmentDate = this.currentDate;
      this.newSlot = this.currentTime;
  
      // Fetch the current appointment details based on appointmentId
      this.loadAppointmentDetails();
    });
  }
  
  // Fetch the current appointment details based on the appointmentId
  loadAppointmentDetails(): void {
    const appointment = this.appointmentsService.getAppointmentById(this.appointmentId);
  
    if (appointment) {
      this.selectedDoctorId = appointment.doctorId;
      this.selectedPatientId = appointment.patientId;  // Prefill the current patient
      this.appointmentType = appointment.appointmentType;  // Prefill the current appointment type
      this.notes = appointment.notes;  // Prefill the notes if necessary
    }
  }
  

  loadDoctors(): void {
    this.doctors = this.doctorsService.getDoctors().map(doctor => ({
      id: doctor.id,
      name: doctor.fullName || 'Unknown Doctor'
    }));
    console.log('Doctors loaded:', this.doctors); // Debugging step 1
  }

  loadPatients(): void {
    this.patients = this.patientsService.getPatients().map(patient => ({
      id: patient.id,
      name: patient.name || 'Unknown Patient'
    }));
  }

  // Method to load schedules for the selected doctor
  loadSchedule(event: any): void {
    this.selectedDoctorId = event.target.value;
    // Use the existing method to get appointments by doctor
    this.schedules = this.appointmentsService.getAppointmentsByDoctor(this.selectedDoctorId);
    console.log('Schedules loaded for doctor:', this.schedules);  // Debugging step
  }

  // Method to create a new appointment schedule
  createSchedule(): void {
    if (!this.appointmentDate || !this.newSlot || !this.selectedDoctorId || !this.selectedPatientId || !this.appointmentType) {
      alert('Please fill in all fields before creating the appointment.');
      return;
    }

    const newAppointment = {
      doctorId: this.selectedDoctorId,
      patientId: this.selectedPatientId,
      appointmentType: this.appointmentType,
      time: this.newSlot,
      appointmentDate: this.appointmentDate,
      notes: this.notes
    };

    // Call service to save the new appointment
    this.appointmentsService.createAppointment(newAppointment);
    alert('Appointment created successfully!');
    
    // Optionally reset the form fields after successful creation
    this.resetForm();
  }

  // Reset form fields after a successful operation
  resetForm(): void {
    this.selectedDoctorId = '';
    this.selectedPatientId = '';
    this.newSlot = '';
    this.appointmentType = '';
    this.notes = '';
    this.appointmentDate = '';
  }

  // Update the appointment with the new date and time
  rescheduleAppointment(): void {
    if (!this.appointmentDate || !this.newSlot) {
      alert('Please select a new date and time for the appointment');
      return;
    }

    const updatedAppointment = {
      id: this.appointmentId,
      doctorId: this.selectedDoctorId,
      patientId: this.selectedPatientId,
      appointmentType: this.appointmentType,
      time: this.newSlot,
      appointmentDate: this.appointmentDate,
      notes: this.notes
    };

    // Call service to update the appointment
    this.appointmentsService.updateAppointment(this.appointmentId, updatedAppointment);
    alert('Appointment rescheduled successfully!');
  }
}
