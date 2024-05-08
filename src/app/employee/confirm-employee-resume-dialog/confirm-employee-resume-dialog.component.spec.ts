import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmployeeResumeDialogComponent } from './confirm-employee-resume-dialog.component';

describe('ConfirmEmployeeResumeDialogComponent', () => {
  let component: ConfirmEmployeeResumeDialogComponent;
  let fixture: ComponentFixture<ConfirmEmployeeResumeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmployeeResumeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmployeeResumeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
