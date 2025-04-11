import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportService, Entry } from 'src/app/Services/report.service'; // <-- Entry imported here

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css']
})
export class IncomeStatementComponent implements OnInit {
  revenues$!: Observable<Entry[]>;
  expenses$!: Observable<Entry[]>;
  insuranceIncome$!: Observable<Entry[]>;  // For insurance payments
  insuranceClaims$!: Observable<Entry[]>; // For insurance claims

  newRevenue: Entry = { name: '', amount: 0 };
  newExpense: Entry = { name: '', amount: 0 };
  newInsuranceIncome: Entry = { name: '', amount: 0 };
  newInsuranceClaim: Entry = { name: '', amount: 0 };

  constructor(public reportService: ReportService) {}

  ngOnInit(): void {
    this.revenues$ = this.reportService.revenues$;
    this.expenses$ = this.reportService.expenses$;
    this.insuranceIncome$ = this.reportService.insuranceIncome$;  // Track insurance income
    this.insuranceClaims$ = this.reportService.insuranceClaims$;  // Track insurance claims
  }

  addRevenue() {
    this.reportService.addRevenue({ ...this.newRevenue });
    this.newRevenue = { name: '', amount: 0 };
  }

  addExpense() {
    this.reportService.addExpense({ ...this.newExpense });
    this.newExpense = { name: '', amount: 0 };
  }

  addInsuranceIncome() {
    this.reportService.addInsuranceIncome({ ...this.newInsuranceIncome });
    this.newInsuranceIncome = { name: '', amount: 0 };
  }

  addInsuranceClaim() {
    this.reportService.addInsuranceClaim({ ...this.newInsuranceClaim });
    this.newInsuranceClaim = { name: '', amount: 0 };
  }

  updateRevenue(index: number, entry: Entry) {
    this.reportService.updateRevenue(index, entry);
  }

  updateExpense(index: number, entry: Entry) {
    this.reportService.updateExpense(index, entry);
  }

  updateInsuranceIncome(index: number, entry: Entry) {
    this.reportService.updateInsuranceIncome(index, entry);
  }

  updateInsuranceClaim(index: number, entry: Entry) {
    this.reportService.updateInsuranceClaim(index, entry);
  }

  deleteRevenue(index: number) {
    this.reportService.deleteRevenue(index);
  }

  deleteExpense(index: number) {
    this.reportService.deleteExpense(index);
  }

  deleteInsuranceIncome(index: number) {
    this.reportService.deleteInsuranceIncome(index);
  }

  deleteInsuranceClaim(index: number) {
    this.reportService.deleteInsuranceClaim(index);
  }

  total(values: Entry[]): number {
    return values.reduce((sum, item) => sum + item.amount, 0);
  }
}
