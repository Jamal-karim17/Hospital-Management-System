import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  userRole: string = '';

  ngOnInit() {
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    this.userRole = authData?.role || '';
  }

  canViewPharmacyMenu(): boolean {
    return this.userRole === 'pharmacist' || this.userRole === 'admin';
  }

}
