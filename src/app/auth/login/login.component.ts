import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  loginError: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    const isLoggedIn = this.authService.login(this.username, this.password);
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = 'Invalid username or password';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
}
