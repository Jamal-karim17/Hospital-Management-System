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

  // Helper function to load data from localStorage
  private loadFromLocalStorage(key: string): Entry[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // Helper function to save data to localStorage
  private saveToLocalStorage(key: string, data: Entry[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  addRevenue(entry: Entry) {
    const currentRevenues = this.revenuesSubject.getValue();
    this.revenuesSubject.next([...currentRevenues, entry]);
    this.saveToLocalStorage('revenues', this.revenuesSubject.getValue());
  }

  addExpense(entry: Entry) {
    const currentExpenses = this.expensesSubject.getValue();
    this.expensesSubject.next([...currentExpenses, entry]);
    this.saveToLocalStorage('expenses', this.expensesSubject.getValue());
  }

  addInsuranceIncome(entry: Entry) {
    const currentIncome = this.insuranceIncomeSubject.getValue();
    this.insuranceIncomeSubject.next([...currentIncome, entry]);
    this.saveToLocalStorage('insuranceIncome', this.insuranceIncomeSubject.getValue());
  }

  addInsuranceClaim(entry: Entry) {
    const currentClaims = this.insuranceClaimsSubject.getValue();
    this.insuranceClaimsSubject.next([...currentClaims, entry]);
    this.saveToLocalStorage('insuranceClaims', this.insuranceClaimsSubject.getValue());
  }

  // New Methods for Assets and Liabilities
  addAsset(entry: Entry) {
    const currentAssets = this.assetsSubject.getValue();
    this.assetsSubject.next([...currentAssets, entry]);
    this.saveToLocalStorage('assets', this.assetsSubject.getValue());
  }

  addLiability(entry: Entry) {
    const currentLiabilities = this.liabilitiesSubject.getValue();
    this.liabilitiesSubject.next([...currentLiabilities, entry]);
    this.saveToLocalStorage('liabilities', this.liabilitiesSubject.getValue());
  }

  removeAsset(index: number) {
    const currentAssets = this.assetsSubject.getValue().filter((_, i) => i !== index);
    this.assetsSubject.next(currentAssets);
    this.saveToLocalStorage('assets', this.assetsSubject.getValue());
  }

  removeLiability(index: number) {
    const currentLiabilities = this.liabilitiesSubject.getValue().filter((_, i) => i !== index);
    this.liabilitiesSubject.next(currentLiabilities);
    this.saveToLocalStorage('liabilities', this.liabilitiesSubject.getValue());
  }

  // Existing update and delete methods for Revenues, Expenses, Insurance Income, and Claims
  updateRevenue(index: number, entry: Entry) {
    const currentRevenues = this.revenuesSubject.getValue();
    currentRevenues[index] = entry;
    this.revenuesSubject.next([...currentRevenues]);
    this.saveToLocalStorage('revenues', this.revenuesSubject.getValue());
  }

  updateExpense(index: number, entry: Entry) {
    const currentExpenses = this.expensesSubject.getValue();
    currentExpenses[index] = entry;
    this.expensesSubject.next([...currentExpenses]);
    this.saveToLocalStorage('expenses', this.expensesSubject.getValue());
  }

  updateInsuranceIncome(index: number, entry: Entry) {
    const currentIncome = this.insuranceIncomeSubject.getValue();
    currentIncome[index] = entry;
    this.insuranceIncomeSubject.next([...currentIncome]);
    this.saveToLocalStorage('insuranceIncome', this.insuranceIncomeSubject.getValue());
  }

  updateInsuranceClaim(index: number, entry: Entry) {
    const currentClaims = this.insuranceClaimsSubject.getValue();
    currentClaims[index] = entry;
    this.insuranceClaimsSubject.next([...currentClaims]);
    this.saveToLocalStorage('insuranceClaims', this.insuranceClaimsSubject.getValue());
  }

  deleteRevenue(index: number) {
    const currentRevenues = this.revenuesSubject.getValue().filter((_, i) => i !== index);
    this.revenuesSubject.next(currentRevenues);
    this.saveToLocalStorage('revenues', this.revenuesSubject.getValue());
  }

  deleteExpense(index: number) {
    const currentExpenses = this.expensesSubject.getValue().filter((_, i) => i !== index);
    this.expensesSubject.next(currentExpenses);
    this.saveToLocalStorage('expenses', this.expensesSubject.getValue());
  }

  deleteInsuranceIncome(index: number) {
    const currentIncome = this.insuranceIncomeSubject.getValue().filter((_, i) => i !== index);
    this.insuranceIncomeSubject.next(currentIncome);
    this.saveToLocalStorage('insuranceIncome', this.insuranceIncomeSubject.getValue());
  }

  deleteInsuranceClaim(index: number) {
    const currentClaims = this.insuranceClaimsSubject.getValue().filter((_, i) => i !== index);
    this.insuranceClaimsSubject.next(currentClaims);
    this.saveToLocalStorage('insuranceClaims', this.insuranceClaimsSubject.getValue());
  }

  // Calculating totals for Revenues, Expenses, Assets, Liabilities
  getTotalRevenue(): number {
    return this.revenuesSubject.getValue().reduce((sum, r) => sum + r.amount, 0);
  }

  getTotalExpenses(): number {
    return this.expensesSubject.getValue().reduce((sum, e) => sum + e.amount, 0);
  }

  getTotalAssets(): number {
    return this.assetsSubject.getValue().reduce((sum, asset) => sum + asset.amount, 0);
  }

  getTotalLiabilities(): number {
    return this.liabilitiesSubject.getValue().reduce((sum, liability) => sum + liability.amount, 0);
  }

  // Get retained earnings (Revenue - Expenses)
  getRetainedEarnings(): number {
    return this.getTotalRevenue() - this.getTotalExpenses();
  }

  // Calculate equity (Assets - Liabilities)
  getEquity(): number {
    return this.getTotalAssets() - this.getTotalLiabilities();
  }

  // Existing methods for getting assets and liabilities
  getAssets(): Entry[] {
    return this.assetsSubject.getValue();
  }

  getLiabilities(): Entry[] {
    return this.liabilitiesSubject.getValue();
  }

  // Get financial data (total sums and key metrics)
  getFinancialData() {
    return {
      totalRevenue: this.getTotalRevenue(),
      totalExpenses: this.getTotalExpenses(),
      netIncome: this.getRetainedEarnings(),
      grossProfitMargin: (this.getTotalRevenue() - this.getTotalExpenses()) / this.getTotalRevenue() * 100,
      inpatientRevenue: this.getTotalRevenue() * 0.4,  // Example distribution
      outpatientRevenue: this.getTotalRevenue() * 0.2, // Example distribution
      pharmacyRevenue: this.getTotalRevenue() * 0.15, // Example distribution
      surgicalRevenue: this.getTotalRevenue() * 0.25, // Example distribution
      staffSalaries: this.getTotalExpenses() * 0.5,    // Example distribution
      medicalSupplies: this.getTotalExpenses() * 0.15, // Example distribution
      adminExpenses: this.getTotalExpenses() * 0.1,    // Example distribution
      utilities: this.getTotalExpenses() * 0.05,       // Example distribution
      totalAssets: this.getTotalAssets(),
      totalLiabilities: this.getTotalLiabilities(),
      equity: this.getEquity(),
      operatingActivities: 100000,   // Static example
      investingActivities: -50000,   // Static example
      financingActivities: 200000,   // Static example
      netCashFlow: 250000,           // Static example
      emergencyDept: 200000,         // Example dept cost
      icuDept: 300000,               // Example dept cost
      outpatientServices: 150000,    // Example dept cost
      currentRatio: 2.0,             // Static example
      quickRatio: 1.5,               // Static example
      debtToEquityRatio: 0.5,        // Static example
      predictedRevenue: 1200000,     // Example forecast
      predictedExpenses: 900000,     // Example forecast
    };
  }
}
