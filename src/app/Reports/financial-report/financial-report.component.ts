import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';

@Component({
  selector: 'app-financial-report',
  templateUrl: './financial-report.component.html',
  styleUrls: ['./financial-report.component.css']
})
export class FinancialReportComponent implements OnInit {

  reportData: any = {};

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport(): void {
    const financialData = this.reportService.getFinancialData();  // Use getFinancialData() method from ReportService

    this.reportData = {
      hospitalName: 'My Hospital',
      address: '123 Hospital St, City, Country',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      generatedDate: new Date().toLocaleDateString(),
      generatedBy: 'Financial System',
      totalRevenue: financialData.totalRevenue,
      totalExpenses: financialData.totalExpenses,
      netIncome: financialData.netIncome,
      grossProfitMargin: financialData.grossProfitMargin,
      inpatientRevenue: financialData.inpatientRevenue,
      outpatientRevenue: financialData.outpatientRevenue,
      pharmacyRevenue: financialData.pharmacyRevenue,
      surgicalRevenue: financialData.surgicalRevenue,
      staffSalaries: financialData.staffSalaries,
      medicalSupplies: financialData.medicalSupplies,
      adminExpenses: financialData.adminExpenses,
      utilities: financialData.utilities,
      totalAssets: financialData.totalAssets,
      totalLiabilities: financialData.totalLiabilities,
      equity: financialData.equity,
      operatingActivities: financialData.operatingActivities,
      investingActivities: financialData.investingActivities,
      financingActivities: financialData.financingActivities,
      netCashFlow: financialData.netCashFlow,
      emergencyDept: financialData.emergencyDept,
      icuDept: financialData.icuDept,
      outpatientServices: financialData.outpatientServices,
      currentRatio: financialData.currentRatio,
      quickRatio: financialData.quickRatio,
      debtToEquityRatio: financialData.debtToEquityRatio,
      predictedRevenue: financialData.predictedRevenue,
      predictedExpenses: financialData.predictedExpenses
    };
  }
}
