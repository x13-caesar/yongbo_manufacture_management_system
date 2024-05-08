import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBatchConfirmDialogComponent } from './cancel-batch-confirm-dialog.component';

describe('CancelBatchConfirmDialogComponent', () => {
  let component: CancelBatchConfirmDialogComponent;
  let fixture: ComponentFixture<CancelBatchConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelBatchConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBatchConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
