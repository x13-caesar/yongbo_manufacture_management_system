import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVendorDialogComponent } from './create-vendor-dialog.component';

describe('CreateVendorDialogComponent', () => {
  let component: CreateVendorDialogComponent;
  let fixture: ComponentFixture<CreateVendorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVendorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVendorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
