import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionFichaComponent } from './publicacion-ficha.component';

describe('PublicacionFichaComponent', () => {
  let component: PublicacionFichaComponent;
  let fixture: ComponentFixture<PublicacionFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionFichaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
