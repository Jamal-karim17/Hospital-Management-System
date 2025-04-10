import { Injectable } from '@angular/core';

interface User {
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private mockUsers: User[] = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'doctor', password: 'doctor123', role: 'doctor' },
    { username: 'nurse', password: 'nurse123', role: 'nurse' },
    { username: 'receptionist', password: 'reception123', role: 'receptionist' },
    { username: 'pharmacist', password: 'pharmacist123', role: 'pharmacist' },
  ];

  constructor() {}

  login(username: string, password: string): boolean {
    // Trim any leading or trailing spaces from the input values
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
  
    // Check if the entered username and password match any stored user credentials
    const user = this.mockUsers.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    );
  
    if (user) {
      // Save user authentication details to localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({ username: user.username, role: user.role, loggedIn: true })
      );
      return true;
    }
    return false;
  }
  

  signup(username: string, password: string, role: string = 'user'): boolean {
    // Get existing users from localStorage or initialize to an empty array
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the username already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      alert('User already exists!');
      return false;
    }

    // If no user exists, create a new one
    const newUser: User = { username, password, role };
    users.push(newUser);

    // Save the updated users array in localStorage
    localStorage.setItem('users', JSON.stringify(users));

    return true;
  }

  resetPassword(username: string, newPassword: string): boolean {
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('auth');
  }

  getAuthStatus(): boolean {
    return JSON.parse(localStorage.getItem('auth') || '{}').loggedIn || false;
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('auth') || '{}');
  }

  getUserRole(): string {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    return authData.role || 'user'; // Default to 'user' if not found
  }
}
