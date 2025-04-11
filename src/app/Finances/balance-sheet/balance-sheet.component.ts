import { Component } from '@angular/core';
import { ReportService } from 'src/app/Services/report.service';

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

  deleteAsset(index: number) {
    this.reportService.removeAsset(index);
  }

  deleteLiability(index: number) {
    this.reportService.removeLiability(index);
  }

  addInsuranceClaim() {
    this.reportService.addInsuranceClaim({ name: 'Insurance Claim', amount: 0 });
  }

  addUnpaidPremium() {
    this.reportService.addUnpaidPremium({ name: 'Unpaid Premium', amount: 0 });
  }

  get retainedEarnings(): number {
    return this.reportService.getRetainedEarnings();
  }
}
