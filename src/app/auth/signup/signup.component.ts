import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'user'; // Default role
  showPassword: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    // Check if passwords match before calling the signup method
    if (this.password === this.confirmPassword) {
      const signupSuccess = this.authService.signup(this.username, this.password, this.role);

      if (signupSuccess) {
        alert('User registered successfully!');
        // Redirect to login or home page if needed
      } else {
        alert('An error occurred during registration.');
      }
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
