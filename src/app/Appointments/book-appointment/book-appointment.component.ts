import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from 'src/app/Services/appointments.service';
import { AuthService } from 'src/app/Services/auth.service';
import { DoctorsService } from 'src/app/Services/doctors.service';
import { Router } from '@angular/router'; // Import Router for navigation
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  doctors: any[] = [];
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  selectedDoctorId: string = '';
  userRole: string = '';
  selectedAppointmentDate: string = '';  // Appointment Date to be selected by user
  selectedAppointmentTime: string = '';  // Appointment Time to be selected by user
  isAscending: boolean = true; // Flag for sorting order (ascending/descending)

  constructor(
    private appointmentsService: AppointmentsService,
    private doctorsService: DoctorsService,
    private authService: AuthService,
    private router: Router, // Inject Router
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAppointments();
    this.userRole = this.authService.getUserRole();
  }

  loadDoctors(): void {
    this.doctors = this.doctorsService.getDoctors().map(doctor => ({
      id: doctor.id,
      name: doctor.fullName || 'Unknown Doctor'
    }));
  }

  loadAppointments(): void {
    this.appointments = this.appointmentsService.getAppointments().map(app => ({
      ...app,
      doctorName: this.appointmentsService.getDoctorName(app.doctorId),
      patientName: this.appointmentsService.getPatientName(app.patientId)
    }));
    this.filterAppointments();  // Ensure the filteredAppointments list is updated after loading the data
  }

  onDoctorSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDoctorId = target.value;
    this.filterAppointments();
  }

  filterAppointments(): void {
    this.filteredAppointments = this.selectedDoctorId
      ? this.appointments.filter(app => app.doctorId === this.selectedDoctorId)
      : this.appointments;
    this.sortAppointments(); // Apply sorting after filtering
  }

  // Function to sort the appointments by date
  sortAppointments(): void {
    this.filteredAppointments.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();
      return this.isAscending ? dateA - dateB : dateB - dateA;
    });
  }

  // Toggle sorting order (ascending/descending)
  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.sortAppointments(); // Re-sort appointments based on the new order
  }

  // Reschedule an appointment by navigating to the ScheduleComponent
  rescheduleAppointment(appointment: any): void {
    // Pass the appointment details as route parameters
    this.router.navigate(['/schedule'], {
      queryParams: {
        doctorId: appointment.doctorId,
        appointmentId: appointment.id,
        currentTime: appointment.time,
        currentDate: appointment.appointmentDate
      }
    });
  }

  // Confirm the appointment and update its status
  bookAppointment(appointment: any): void {
    appointment.status = 'Confirmed';  // Change status to 'Confirmed'
    this.appointmentsService.updateAppointment(appointment.id, { status: 'Confirmed' }); // Pass ID and updated status
    this.loadAppointments();  // Refresh the appointments list
  }

  // Delete an appointment
  deleteAppointment(appointment: any): void {
    this.appointmentsService.cancelAppointment(appointment.id);
    this.filteredAppointments = this.filteredAppointments.filter(app => app.id !== appointment.id);
  }

  finishAppointment(appointment: any): void {
    // Update the appointment status to 'Finished' in your service
    this.appointmentsService.updateAppointment(appointment.id, { status: 'Finished' });
  
    // Update filteredAppointments immediately in the UI
    const updatedAppointments = this.filteredAppointments.map(app =>
      app.id === appointment.id ? { ...app, status: 'Finished' } : app
    );
    this.filteredAppointments = updatedAppointments;
  
    // Send a notification that the appointment is finished
    this.notificationService.sendNotification(`The appointment with patient ${appointment.patientName} has been finished.`);
  }
}
