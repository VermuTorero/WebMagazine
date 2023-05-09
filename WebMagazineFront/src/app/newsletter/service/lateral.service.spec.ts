import { TestBed } from '@angular/core/testing';

import { LateralServiceService } from './lateral.service';

describe('LateralesServiceService', () => {
  let service: LateralServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LateralServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
