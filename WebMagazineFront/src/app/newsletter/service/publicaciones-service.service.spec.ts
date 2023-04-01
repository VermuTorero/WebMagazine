import { TestBed } from '@angular/core/testing';

import { PublicacionesServiceService } from './publicaciones-service.service';

describe('PublicacionesServiceService', () => {
  let service: PublicacionesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicacionesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
