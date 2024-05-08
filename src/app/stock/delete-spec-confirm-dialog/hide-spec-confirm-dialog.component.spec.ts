import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideSpecConfirmDialogComponent } from './hide-spec-confirm-dialog.component';

describe('DeleteSpecConfirmDialogComponent', () => {
  let component: HideSpecConfirmDialogComponent;
  let fixture: ComponentFixture<HideSpecConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HideSpecConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HideSpecConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
