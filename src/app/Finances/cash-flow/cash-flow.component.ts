import { Component } from '@angular/core';
import { CashFlowService, CashTransaction } from 'src/app/Services/cash-flow.service';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.css']
})
export class CashFlowComponent {
  typeFilter: string = 'All';
  startDate: string = '';
  endDate: string = '';

  newTransaction: CashTransaction = {
    type: 'Operating',
    description: '',
    amount: 0,
    date: new Date().toISOString().substring(0, 10)
  };

  constructor(public cashFlowService: CashFlowService) {}

  get filteredTransactions(): CashTransaction[] {
    return this.cashFlowService.filterTransactions(
      this.typeFilter,
      this.startDate || '1900-01-01',
      this.endDate || '9999-12-31'
    );
  }

  addTransaction(): void {
    this.cashFlowService.addTransaction({ ...this.newTransaction });
    this.newTransaction = {
      type: 'Operating',
      description: '',
      amount: 0,
      date: new Date().toISOString().substring(0, 10)
    };
  }

  deleteTransaction(index: number): void {
    this.cashFlowService.deleteTransaction(index);
  }

  getNet(type: 'Operating' | 'Investing' | 'Financing'): number {
    return this.cashFlowService.getNetCashFlowByType(type);
  }

  get totalNetChange(): number {
    return this.cashFlowService.getTotalNetChange();
  }

  // New methods to add insurance transactions

  addInsurancePayment() {
    // Assuming insurance payments made to the hospital are considered as inflows under Operating
    const insurancePayment: CashTransaction = {
      type: 'Operating',
      description: 'Insurance Payment (Inflow)',
      amount: 10000,  // Replace with actual amount or user input
      date: new Date().toISOString().substring(0, 10)
    };
    this.cashFlowService.addTransaction(insurancePayment);
  }

  addInsuranceClaim() {
    // Assuming insurance claims for premiums are considered as outflows under Operating
    const insuranceClaim: CashTransaction = {
      type: 'Operating',
      description: 'Insurance Claim (Outflow)',
      amount: 5000,  // Replace with actual amount or user input
      date: new Date().toISOString().substring(0, 10)
    };
    this.cashFlowService.addTransaction(insuranceClaim);
  }
}
