import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideComponentDialogComponent } from './hide-component-dialog.component';

describe('DeleteComponentDialogComponent', () => {
  let component: HideComponentDialogComponent;
  let fixture: ComponentFixture<HideComponentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HideComponentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HideComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
