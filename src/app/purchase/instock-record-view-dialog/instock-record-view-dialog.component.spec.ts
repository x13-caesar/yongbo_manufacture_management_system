import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockRecordViewDialogComponent } from './instock-record-view-dialog.component';

describe('InstockRecordViewDialogComponent', () => {
  let component: InstockRecordViewDialogComponent;
  let fixture: ComponentFixture<InstockRecordViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockRecordViewDialogComponent]
    });
    fixture = TestBed.createComponent(InstockRecordViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
