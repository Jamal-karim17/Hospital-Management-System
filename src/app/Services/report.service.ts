import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Entry {
  name: string;
  amount: number;
  category?: string;
  date?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private revenuesSubject = new BehaviorSubject<Entry[]>(this.loadFromLocalStorage('revenues') || []);
  private expensesSubject = new BehaviorSubject<Entry[]>(this.loadFromLocalStorage('expenses') || []);
  private insuranceIncomeSubject = new BehaviorSubject<Entry[]>(this.loadFromLocalStorage('insuranceIncome') || []);
  private insuranceClaimsSubject = new BehaviorSubject<Entry[]>(this.loadFromLocalStorage('insuranceClaims') || []);
  private assetsSubject = new BehaviorSubject<Entry[]>(this.loadFromLocalStorage('assets') || []);
  private liabilitiesSubject = new BehaviorSubject<Entry[]>(this.loadFromLocalStorage('liabilities') || []);

  revenues$ = this.revenuesSubject.asObservable();
  expenses$ = this.expensesSubject.asObservable();
  insuranceIncome$ = this.insuranceIncomeSubject.asObservable();
  insuranceClaims$ = this.insuranceClaimsSubject.asObservable();
  assets$ = this.assetsSubject.asObservable();
  liabilities$ = this.liabilitiesSubject.asObservable();

  constructor() {}

  private loadFromLocalStorage(key: string): Entry[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(key: string, data: Entry[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  addRevenue(entry: Entry) {
    const current = this.revenuesSubject.getValue();
    this.revenuesSubject.next([...current, entry]);
    this.saveToLocalStorage('revenues', this.revenuesSubject.getValue());
  }

  addExpense(entry: Entry) {
    const current = this.expensesSubject.getValue();
    this.expensesSubject.next([...current, entry]);
    this.saveToLocalStorage('expenses', this.expensesSubject.getValue());
  }

  addInsuranceIncome(entry: Entry) {
    const current = this.insuranceIncomeSubject.getValue();
    this.insuranceIncomeSubject.next([...current, entry]);
    this.saveToLocalStorage('insuranceIncome', this.insuranceIncomeSubject.getValue());
  }

  addInsuranceClaim(entry: Entry) {
    const current = this.insuranceClaimsSubject.getValue();
    this.insuranceClaimsSubject.next([...current, entry]);
    this.saveToLocalStorage('insuranceClaims', this.insuranceClaimsSubject.getValue());
  }

  addAsset(entry: Entry) {
    const current = this.assetsSubject.getValue();
    this.assetsSubject.next([...current, entry]);
    this.saveToLocalStorage('assets', this.assetsSubject.getValue());
  }

  addLiability(entry: Entry) {
    const current = this.liabilitiesSubject.getValue();
    this.liabilitiesSubject.next([...current, entry]);
    this.saveToLocalStorage('liabilities', this.liabilitiesSubject.getValue());
  }

  removeAsset(index: number) {
    const updated = this.assetsSubject.getValue().filter((_, i) => i !== index);
    this.assetsSubject.next(updated);
    this.saveToLocalStorage('assets', updated);
  }

  removeLiability(index: number) {
    const updated = this.liabilitiesSubject.getValue().filter((_, i) => i !== index);
    this.liabilitiesSubject.next(updated);
    this.saveToLocalStorage('liabilities', updated);
  }

  updateRevenue(index: number, entry: Entry) {
    const updated = [...this.revenuesSubject.getValue()];
    updated[index] = entry;
    this.revenuesSubject.next(updated);
    this.saveToLocalStorage('revenues', updated);
  }

  updateExpense(index: number, entry: Entry) {
    const updated = [...this.expensesSubject.getValue()];
    updated[index] = entry;
    this.expensesSubject.next(updated);
    this.saveToLocalStorage('expenses', updated);
  }

  updateInsuranceIncome(index: number, entry: Entry) {
    const updated = [...this.insuranceIncomeSubject.getValue()];
    updated[index] = entry;
    this.insuranceIncomeSubject.next(updated);
    this.saveToLocalStorage('insuranceIncome', updated);
  }

  updateInsuranceClaim(index: number, entry: Entry) {
    const updated = [...this.insuranceClaimsSubject.getValue()];
    updated[index] = entry;
    this.insuranceClaimsSubject.next(updated);
    this.saveToLocalStorage('insuranceClaims', updated);
  }

  deleteRevenue(index: number) {
    const updated = this.revenuesSubject.getValue().filter((_, i) => i !== index);
    this.revenuesSubject.next(updated);
    this.saveToLocalStorage('revenues', updated);
  }

  deleteExpense(index: number) {
    const updated = this.expensesSubject.getValue().filter((_, i) => i !== index);
    this.expensesSubject.next(updated);
    this.saveToLocalStorage('expenses', updated);
  }

  deleteInsuranceIncome(index: number) {
    const updated = this.insuranceIncomeSubject.getValue().filter((_, i) => i !== index);
    this.insuranceIncomeSubject.next(updated);
    this.saveToLocalStorage('insuranceIncome', updated);
  }

  deleteInsuranceClaim(index: number) {
    const updated = this.insuranceClaimsSubject.getValue().filter((_, i) => i !== index);
    this.insuranceClaimsSubject.next(updated);
    this.saveToLocalStorage('insuranceClaims', updated);
  }

  getTotalRevenue(): number {
    return this.revenuesSubject.getValue().reduce((sum, r) => sum + r.amount, 0);
  }

  getTotalExpenses(): number {
    return this.expensesSubject.getValue().reduce((sum, e) => sum + e.amount, 0);
  }

  getTotalAssets(): number {
    return this.getAssets().reduce((sum, asset) => sum + asset.amount, 0);
  }

  getTotalLiabilities(): number {
    return this.getLiabilities().reduce((sum, liability) => sum + liability.amount, 0);
  }

  getRetainedEarnings(): number {
    return this.getTotalRevenue() - this.getTotalExpenses();
  }

  getEquity(): number {
    return this.getTotalAssets() - this.getTotalLiabilities();
  }

  getAssets(): Entry[] {
    return [...this.assetsSubject.getValue(), ...this.revenuesSubject.getValue()];
  }

  getLiabilities(): Entry[] {
    return [...this.liabilitiesSubject.getValue(), ...this.expensesSubject.getValue()];
  }

  getFinancialData() {
    const totalRevenue = this.getTotalRevenue();
    const totalExpenses = this.getTotalExpenses();
    const netIncome = this.getRetainedEarnings();

    return {
      totalRevenue,
      totalExpenses,
      netIncome,
      grossProfitMargin: totalRevenue ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0,
      inpatientRevenue: totalRevenue * 0.4,
      outpatientRevenue: totalRevenue * 0.2,
      pharmacyRevenue: totalRevenue * 0.15,
      surgicalRevenue: totalRevenue * 0.25,
      staffSalaries: totalExpenses * 0.5,
      medicalSupplies: totalExpenses * 0.15,
      adminExpenses: totalExpenses * 0.1,
      utilities: totalExpenses * 0.05,
      totalAssets: this.getTotalAssets(),
      totalLiabilities: this.getTotalLiabilities(),
      equity: this.getEquity(),
      operatingActivities: 100000,
      investingActivities: -50000,
      financingActivities: 200000,
      netCashFlow: 250000,
      emergencyDept: 200000,
      icuDept: 300000,
      outpatientServices: 150000,
      currentRatio: 2.0,
      quickRatio: 1.5,
      debtToEquityRatio: 0.5,
      predictedRevenue: 1200000,
      predictedExpenses: 900000,
    };
  }
}
