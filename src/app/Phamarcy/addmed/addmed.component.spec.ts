import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmedComponent } from './addmed.component';

describe('AddmedComponent', () => {
  let component: AddmedComponent;
  let fixture: ComponentFixture<AddmedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddmedComponent]
    });
    fixture = TestBed.createComponent(AddmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
