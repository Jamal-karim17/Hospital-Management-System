import { Component, OnInit } from '@angular/core';
import { PatientsService } from 'src/app/Services/patients.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service'; // Ensure this service exists

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchQuery: string = '';
  userRole: string = 'admin'; // Default role

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Fetch user role from authentication service
    this.userRole = this.authService.getUserRole(); 

    this.loadPatients();
  }

  loadPatients(): void {
    this.patients = this.patientsService.getPatients();

    // Ensure every newly added patient has 'Active' status
    this.patients.forEach(patient => {
      if (!patient.discharged) {
        patient.discharged = 'Active';
      }
    });

    this.filteredPatients = [...this.patients];
  }

  viewPatient(id: string): void {
    this.router.navigate([`/patients/profile`, id]);
  }

  dischargePatient(id: string): void {
    this.patientsService.dischargePatient(id);
    this.loadPatients(); // Refresh list after updating status
  }

  deletePatient(id: string): void {
    if (this.userRole === 'admin') { // Ensure only admin can delete
      this.patientsService.deletePatient(id);
      this.loadPatients(); // Refresh list after deletion
    }
  }

  searchPatient(): void {
    this.filteredPatients = this.searchQuery.trim()
      ? this.patients.filter((patient) =>
          patient.name?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : this.patients;
  }
}
