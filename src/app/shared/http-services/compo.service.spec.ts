import { TestBed } from '@angular/core/testing';

import { CompoService } from './compo.service';

describe('CompoService', () => {
  let service: CompoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
