import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoTiendaComponent } from './promo-tienda.component';

describe('PromoTiendaComponent', () => {
  let component: PromoTiendaComponent;
  let fixture: ComponentFixture<PromoTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoTiendaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
