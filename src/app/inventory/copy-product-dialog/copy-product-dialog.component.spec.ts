import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyProductDialogComponent } from './copy-product-dialog.component';

describe('CopyProductDialogComponent', () => {
  let component: CopyProductDialogComponent;
  let fixture: ComponentFixture<CopyProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyProductDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
