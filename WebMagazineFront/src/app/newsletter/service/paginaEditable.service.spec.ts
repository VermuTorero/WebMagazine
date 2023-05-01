import { TestBed } from '@angular/core/testing';

import { PaginaEditableService } from './paginaEditable.service';

describe('PaginaEditableService', () => {
  let service: PaginaEditableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginaEditableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
