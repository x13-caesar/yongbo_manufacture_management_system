import { TestBed } from '@angular/core/testing';

import { WarehouseRecordService } from './warehouse-record.service';

describe('WarehouseRecordService', () => {
  let service: WarehouseRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
