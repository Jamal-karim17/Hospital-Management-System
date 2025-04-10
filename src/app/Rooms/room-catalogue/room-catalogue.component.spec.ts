import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCatalogueComponent } from './room-catalogue.component';

describe('RoomCatalogueComponent', () => {
  let component: RoomCatalogueComponent;
  let fixture: ComponentFixture<RoomCatalogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomCatalogueComponent]
    });
    fixture = TestBed.createComponent(RoomCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
