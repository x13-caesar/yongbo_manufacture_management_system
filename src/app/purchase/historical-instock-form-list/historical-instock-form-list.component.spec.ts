import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalInstockFormListComponent } from './historical-instock-form-list.component';

describe('HistoricalInstockFormListComponent', () => {
  let component: HistoricalInstockFormListComponent;
  let fixture: ComponentFixture<HistoricalInstockFormListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalInstockFormListComponent]
    });
    fixture = TestBed.createComponent(HistoricalInstockFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
