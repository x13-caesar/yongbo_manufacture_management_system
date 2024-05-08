import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFinishFormDialogComponent } from './confirm-finish-form-dialog.component';

describe('ConfirmFinishFormDialogComponent', () => {
  let component: ConfirmFinishFormDialogComponent;
  let fixture: ComponentFixture<ConfirmFinishFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmFinishFormDialogComponent]
    });
    fixture = TestBed.createComponent(ConfirmFinishFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
