import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverySummaryComponent } from './delivery-summary.component';

describe('MonthlySummaryComponent', () => {
  let component: DeliverySummaryComponent;
  let fixture: ComponentFixture<DeliverySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
