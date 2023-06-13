import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscripcionFichaComponent } from './suscripcion-ficha.component';

describe('SuscripcionFichaComponent', () => {
  let component: SuscripcionFichaComponent;
  let fixture: ComponentFixture<SuscripcionFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuscripcionFichaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuscripcionFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
