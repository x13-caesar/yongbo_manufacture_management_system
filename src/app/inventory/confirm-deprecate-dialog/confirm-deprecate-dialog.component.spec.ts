import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeprecateDialogComponent } from './confirm-deprecate-dialog.component';

describe('ConfirmDeprecateDialogComponent', () => {
  let component: ConfirmDeprecateDialogComponent;
  let fixture: ComponentFixture<ConfirmDeprecateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeprecateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeprecateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
