import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalInstockRecordListComponent } from './historical-instock-record-list.component';

describe('HistoryInstockRecordListComponent', () => {
  let component: HistoricalInstockRecordListComponent;
  let fixture: ComponentFixture<HistoricalInstockRecordListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalInstockRecordListComponent]
    });
    fixture = TestBed.createComponent(HistoricalInstockRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
