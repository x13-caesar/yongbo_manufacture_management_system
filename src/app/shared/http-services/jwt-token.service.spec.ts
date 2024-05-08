import { TestBed } from '@angular/core/testing';

import { JWTTokenService } from './jwt-token.service';

describe('JWTTokenService', () => {
  let service: JWTTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JWTTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
