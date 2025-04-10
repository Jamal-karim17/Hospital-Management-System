import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { PatientsService } from 'src/app/Services/patients.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  patientId!: string;
  patient: any;
  errorMessage: string | null = null;
  userRole: string = ''; 
  selectedFile: File | null = null;
  fileName: string | null = null;
  fileUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientsService: PatientsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    
    this.route.params.subscribe((params) => {
     
      this.patientId = params['id'];

      // Fetch patient details from the service using the patientId
      this.patient = this.patientsService.getPatientById(this.patientId);

      // Handle the case when the patient is not found
      if (!this.patient) {
        this.errorMessage = 'Patient not found';
        return;  // Prevent further processing if patient is not found
      }

      this.errorMessage = null;  // Reset error if patient is found
    });
  }

  updatePatient(): void {
    if (!this.patient) {
      // Handle case where patient data is not available
      this.errorMessage = 'Cannot update. Patient data is missing.';
      return;
    }

    // Handle file upload if a file is selected
    if (this.selectedFile) {
      // Simulate saving the file path by appending it to the patient description.
      // In a real scenario, you'd upload the file to the server and save the file URL.
      const filePath = URL.createObjectURL(this.selectedFile);  // Temporarily create a local URL for the file

      // Save the file URL and name to the patient data
      this.patient.description += `\nFile uploaded: ${this.fileName}\nView: ${filePath}`;

      // Set the file URL for later viewing or downloading
      this.fileUrl = filePath;
    }

    // Update the patient data
    this.patientsService.updatePatient(this.patient);
    // Navigate back to the patient list page after update
    this.router.navigate(['/patients/list']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;

      // For simplicity, we're using a temporary URL for local viewing or downloading
      this.fileUrl = URL.createObjectURL(file);
    }
  }
}
