import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmployeeLeaveDialogComponent } from './confirm-employee-leave-dialog.component';

describe('ConfirmEmployeeLeaveDialogComponent', () => {
  let component: ConfirmEmployeeLeaveDialogComponent;
  let fixture: ComponentFixture<ConfirmEmployeeLeaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmployeeLeaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmployeeLeaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
