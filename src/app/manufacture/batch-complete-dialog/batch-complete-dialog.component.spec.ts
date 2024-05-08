import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCompleteDialogComponent } from './batch-complete-dialog.component';

describe('BatchCompleteDialogComponent', () => {
  let component: BatchCompleteDialogComponent;
  let fixture: ComponentFixture<BatchCompleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchCompleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
