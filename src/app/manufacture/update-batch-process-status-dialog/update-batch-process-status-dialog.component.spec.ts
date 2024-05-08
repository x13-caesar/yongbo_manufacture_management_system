import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBatchProcessStatusDialogComponent } from './update-batch-process-status-dialog.component';

describe('UpdateBatchProcessStatusDialogComponent', () => {
  let component: UpdateBatchProcessStatusDialogComponent;
  let fixture: ComponentFixture<UpdateBatchProcessStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBatchProcessStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBatchProcessStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
