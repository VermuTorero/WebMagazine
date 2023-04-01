import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalEcommerceComponent } from './principal-ecommerce.component';

describe('PrincipalEcommerceComponent', () => {
  let component: PrincipalEcommerceComponent;
  let fixture: ComponentFixture<PrincipalEcommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipalEcommerceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
