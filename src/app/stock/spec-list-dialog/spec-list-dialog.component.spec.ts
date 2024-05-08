import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecListDialogComponent } from './spec-list-dialog.component';

describe('SpecListDialogComponent', () => {
  let component: SpecListDialogComponent;
  let fixture: ComponentFixture<SpecListDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecListDialogComponent]
    });
    fixture = TestBed.createComponent(SpecListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
