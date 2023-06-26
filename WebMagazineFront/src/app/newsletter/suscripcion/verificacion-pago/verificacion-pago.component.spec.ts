import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionPagoComponent } from './verificacion-pago.component';

describe('VerificacionPagoComponent', () => {
  let component: VerificacionPagoComponent;
  let fixture: ComponentFixture<VerificacionPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificacionPagoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
