import { Component } from '@angular/core';
import { PatientsService } from 'src/app/Services/patients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  patient = {
    id: '', // Add an ID field
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    reason: '',
  };

  constructor(private patientsService: PatientsService, private router: Router) {}

  registerPatient(): void {
    // Generate a unique ID based on the current timestamp (or use another method if desired)
    this.patient.id = 'P-' + new Date().getTime();  // A simple way to generate a unique ID

    // Add the patient with the generated ID
    this.patientsService.addPatient(this.patient);

    // Navigate to the patient list
    this.router.navigate(['/patients/list']);
  }
}
