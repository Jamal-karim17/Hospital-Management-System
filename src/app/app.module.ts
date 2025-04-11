import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './Patients/register/register.component';
import { ListComponent } from './Patients/list/list.component';
import { ProfileComponent } from './Patients/profile/profile.component';
import { DoctorsListComponent } from './Doctors/doctors-list/doctors-list.component';
import { DoctorsProfileComponent } from './Doctors/doctors-profile/doctors-profile.component';
import { ScheduleComponent } from './Doctors/schedule/schedule.component';
;
import { BookAppointmentComponent } from './Appointments/book-appointment/book-appointment.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { InvoiceListComponent } from './Billing/invoice-list/invoice-list.component';
import { GenerateInvoiceComponent } from './Billing/generate-invoice/generate-invoice.component';
import { PaymentComponent } from './payment/payment.component';
import { AddmedComponent } from './Phamarcy/addmed/addmed.component';
import { MedlistComponent } from './Phamarcy/medlist/medlist.component';
import { StockmanagementComponent } from './Phamarcy/stockmanagement/stockmanagement.component';
import { OrdersComponent } from './Phamarcy/orders/orders.component';
import { QueueComponent } from './Phamarcy/queue/queue.component';
import { BedCatalogueComponent } from './Bed/bed-catalogue/bed-catalogue.component';
import { AddEditRoomComponent } from './Rooms/add-edit-room/add-edit-room.component';
import { RoomCatalogueComponent } from './Rooms/room-catalogue/room-catalogue.component';
import { IncomeStatementComponent } from './Finances/income-statement/income-statement.component';
import { BalanceSheetComponent } from './Finances/balance-sheet/balance-sheet.component';
import { CashFlowComponent } from './Finances/cash-flow/cash-flow.component';
import { FinancialReportComponent } from './Reports/financial-report/financial-report.component';



@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    NavbarComponent,
    RegisterComponent,
    ListComponent,
    ProfileComponent,
    DoctorsListComponent,
    DoctorsProfileComponent,
    ScheduleComponent,
  
   
    BookAppointmentComponent,
        SettingsComponent,
        NotificationsComponent,
        InvoiceListComponent,
        GenerateInvoiceComponent,
        PaymentComponent,
        AddmedComponent,
        MedlistComponent,
        StockmanagementComponent,
        OrdersComponent,
        QueueComponent,
        BedCatalogueComponent,
        AddEditRoomComponent,
        RoomCatalogueComponent,
        IncomeStatementComponent,
        BalanceSheetComponent,
        CashFlowComponent,
        FinancialReportComponent,
      
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
  
    AppRoutingModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
