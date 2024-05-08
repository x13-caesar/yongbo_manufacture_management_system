import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockFormSingleViewDialogComponent } from './instock-form-single-view-dialog.component';

describe('InstockFormSingleViewDialogComponent', () => {
  let component: InstockFormSingleViewDialogComponent;
  let fixture: ComponentFixture<InstockFormSingleViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockFormSingleViewDialogComponent]
    });
    fixture = TestBed.createComponent(InstockFormSingleViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
