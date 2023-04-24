import { TestBed } from '@angular/core/testing';
import { LandingPagesServiceService } from './landingPages.service';



describe('TagsServiceService', () => {
  let service: LandingPagesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingPagesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
