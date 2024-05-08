import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteWorkDialogComponent } from './complete-work-dialog.component';

describe('CompleteWorkDialogComponent', () => {
  let component: CompleteWorkDialogComponent;
  let fixture: ComponentFixture<CompleteWorkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteWorkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteWorkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
