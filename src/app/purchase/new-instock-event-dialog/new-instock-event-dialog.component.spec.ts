import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInstockEventDialogComponent } from './new-instock-event-dialog.component';

describe('NewInstockEventDialogComponent', () => {
  let component: NewInstockEventDialogComponent;
  let fixture: ComponentFixture<NewInstockEventDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewInstockEventDialogComponent]
    });
    fixture = TestBed.createComponent(NewInstockEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
