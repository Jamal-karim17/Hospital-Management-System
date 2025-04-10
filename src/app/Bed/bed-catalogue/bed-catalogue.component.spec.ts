import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedCatalogueComponent } from './bed-catalogue.component';

describe('BedCatalogueComponent', () => {
  let component: BedCatalogueComponent;
  let fixture: ComponentFixture<BedCatalogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BedCatalogueComponent]
    });
    fixture = TestBed.createComponent(BedCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
