import { Injectable } from '@angular/core';

export interface CashTransaction {
  type: 'Operating' | 'Investing' | 'Financing';
  description: string;
  amount: number;
  date: string; // ISO date string
}

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {
  private cashTransactions: CashTransaction[] = [];

  getTransactions(): CashTransaction[] {
    return this.cashTransactions;
  }

  addTransaction(transaction: CashTransaction): void {
    this.cashTransactions.push(transaction);
  }

  deleteTransaction(index: number): void {
    this.cashTransactions.splice(index, 1);
  }

  filterTransactions(type: string, start: string, end: string): CashTransaction[] {
    return this.cashTransactions.filter(t =>
      (type === 'All' || t.type === type) &&
      new Date(t.date) >= new Date(start) &&
      new Date(t.date) <= new Date(end)
    );
  }

  getNetCashFlowByType(type: 'Operating' | 'Investing' | 'Financing'): number {
    return this.cashTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalNetChange(): number {
    return this.cashTransactions.reduce((sum, t) => sum + t.amount, 0);
  }
}
