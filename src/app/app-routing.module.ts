import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { RegisterComponent } from './Patients/register/register.component';
import { ListComponent } from './Patients/list/list.component';
import { ProfileComponent } from './Patients/profile/profile.component';
import { DoctorsListComponent } from './Doctors/doctors-list/doctors-list.component';
import { DoctorsProfileComponent } from './Doctors/doctors-profile/doctors-profile.component';
import { ScheduleComponent } from './Doctors/schedule/schedule.component';

import { BookAppointmentComponent } from './Appointments/book-appointment/book-appointment.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { InvoiceListComponent } from './Billing/invoice-list/invoice-list.component';
import { GenerateInvoiceComponent } from './Billing/generate-invoice/generate-invoice.component';
import { PaymentComponent } from './payment/payment.component';
import { AddmedComponent } from './Phamarcy/addmed/addmed.component';
import { MedlistComponent } from './Phamarcy/medlist/medlist.component';
import { StockmanagementComponent } from './Phamarcy/stockmanagement/stockmanagement.component';
import { SignupComponent } from './auth/signup/signup.component';
import { OrdersComponent } from './Phamarcy/orders/orders.component';
import { QueueComponent } from './Phamarcy/queue/queue.component';
import { BedCatalogueComponent } from './Bed/bed-catalogue/bed-catalogue.component';
import { AddEditRoomComponent } from './Rooms/add-edit-room/add-edit-room.component';
import { RoomCatalogueComponent } from './Rooms/room-catalogue/room-catalogue.component';
import { IncomeStatementComponent } from './Finances/income-statement/income-statement.component';
import { BalanceSheetComponent } from './Finances/balance-sheet/balance-sheet.component';
import { CashFlowService } from './Services/cash-flow.service';
import { CashFlowComponent } from './Finances/cash-flow/cash-flow.component';
import { FinancialReportComponent } from './Reports/financial-report/financial-report.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'register', component: SignupComponent},
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'patients/register', component: RegisterComponent },
  { path: 'patients/list', component: ListComponent },
  { path: 'patients/profile/:id', component: ProfileComponent},

  { path: 'doctors/list', component: DoctorsListComponent},
  { path: 'doctor-profile/:id', component: DoctorsProfileComponent },
  { path: 'schedule',component: ScheduleComponent},

  { path: 'invoicelist', component: InvoiceListComponent},
  {path: 'generateinvoice', component: GenerateInvoiceComponent},

  {path: 'addmedicine', component: AddmedComponent},
  {path: 'medicinelist', component: MedlistComponent},
  {path: 'orders', component: OrdersComponent},
  {path: 'stockmanagement', component: StockmanagementComponent},
  {path: 'queue', component: QueueComponent},

  {path: 'bedcatalogue', component: BedCatalogueComponent},

  {path:'roommanagement', component: AddEditRoomComponent},
  {path: 'roomcatalogue', component: RoomCatalogueComponent},

  {path: 'incomestatement', component: IncomeStatementComponent},
  {path: 'balancesheet', component: BalanceSheetComponent},
  {path: 'cashflow', component: CashFlowComponent},

  {path: 'reports/financial', component: FinancialReportComponent},

  { path: 'settings', component: SettingsComponent},

  
  { path: 'bookappointment', component: BookAppointmentComponent},
  { path: 'payment/:id', component: PaymentComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
