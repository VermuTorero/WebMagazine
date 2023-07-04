import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovarSuscripcionComponent } from './renovar-suscripcion.component';

describe('RenovarSuscripcionComponent', () => {
  let component: RenovarSuscripcionComponent;
  let fixture: ComponentFixture<RenovarSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovarSuscripcionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovarSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
