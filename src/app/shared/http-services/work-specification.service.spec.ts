import { TestBed } from '@angular/core/testing';

import { WorkSpecificationService } from './work-specification.service';

describe('WorkSpecificationService', () => {
  let service: WorkSpecificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkSpecificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
