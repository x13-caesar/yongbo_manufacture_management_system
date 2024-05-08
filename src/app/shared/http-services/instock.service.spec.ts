import { TestBed } from '@angular/core/testing';

import { InstockService } from './instock.service';

describe('InstockService', () => {
  let service: InstockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
