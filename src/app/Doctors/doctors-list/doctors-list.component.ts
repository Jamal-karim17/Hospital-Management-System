import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { DoctorsService } from 'src/app/Services/doctors.service';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  doctorsList: any[] = [];
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  doctor: any = {};
  userRole: string = ''; 

  constructor(private doctorsService: DoctorsService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadDoctors();
  }

  private loadDoctors(): void {
    this.doctorsList = this.doctorsService.getDoctors();
  }

  openAddDoctorForm(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.resetDoctorForm();
  }

  viewDoctorDetails(doctorId: string): void {
    doctorId
      ? this.router.navigate(['/doctor-profile', doctorId])
      : console.error('Doctor ID is undefined!');
  }

  editDoctor(doctor: any): void {
    this.isEditMode = true;
    this.doctor = { ...doctor };
    this.isModalOpen = true;
  }

  deleteDoctor(doctorId: string): void {
    this.doctorsService.deleteDoctor(doctorId);
    this.loadDoctors();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetDoctorForm(); // Reset the form when closing modal
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.doctorsService.editDoctor(this.doctor.id, this.doctor);
    } else {
      this.doctorsService.addDoctor(this.doctor);
    }

    this.closeModal();
    this.loadDoctors();
  }

  private resetDoctorForm(): void {
    this.doctor = {}; // Reset form fields after close
  }

 
}
