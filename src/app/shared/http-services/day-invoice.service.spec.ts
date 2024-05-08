import { TestBed } from '@angular/core/testing';

import { DayInvoiceService } from './day-invoice.service';

describe('DayInvoiceService', () => {
  let service: DayInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
