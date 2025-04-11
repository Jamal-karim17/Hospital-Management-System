import { Component } from '@angular/core';
import { ReportService, Entry } from 'src/app/Services/report.service';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent {
  constructor(public reportService: ReportService) {}

  addAsset() {
    this.reportService.addAsset({ name: 'New Asset', amount: 0 });
  }

  addLiability() {
    this.reportService.addLiability({ name: 'New Liability', amount: 0 });
  }

  addInsuranceClaim() {
    // Assuming an insurance claim is a receivable, and adding it to assets
    this.reportService.addAsset({ name: 'Insurance Claim', amount: 0 });
  }

  addUnpaidPremium() {
    // Assuming an unpaid premium is a liability
    this.reportService.addLiability({ name: 'Unpaid Premium', amount: 0 });
  }

  deleteAsset(index: number) {
    this.reportService.removeAsset(index);
  }

  deleteLiability(index: number) {
    this.reportService.removeLiability(index);
  }

  get retainedEarnings(): number {
    return this.reportService.getRetainedEarnings();
  }
}
