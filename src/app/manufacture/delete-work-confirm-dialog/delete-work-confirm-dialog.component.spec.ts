import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWorkConfirmDialogComponent } from './delete-work-confirm-dialog.component';

describe('DeleteWorkConfirmDialogComponent', () => {
  let component: DeleteWorkConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteWorkConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWorkConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWorkConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
