import { TestBed } from '@angular/core/testing';

import { BatchProcessService } from './batch-process.service';

describe('BatchProcessService', () => {
  let service: BatchProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
