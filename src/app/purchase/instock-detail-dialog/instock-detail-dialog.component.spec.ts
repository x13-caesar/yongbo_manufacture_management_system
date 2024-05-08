import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstockDetailDialogComponent } from './instock-detail-dialog.component';

describe('InstockDetailDialogComponent', () => {
  let component: InstockDetailDialogComponent;
  let fixture: ComponentFixture<InstockDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstockDetailDialogComponent]
    });
    fixture = TestBed.createComponent(InstockDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
