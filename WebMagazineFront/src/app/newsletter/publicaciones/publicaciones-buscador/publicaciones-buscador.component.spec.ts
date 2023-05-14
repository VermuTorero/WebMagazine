import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesBuscadorComponent } from './publicaciones-buscador.component';

describe('PublicacionesBuscadorComponent', () => {
  let component: PublicacionesBuscadorComponent;
  let fixture: ComponentFixture<PublicacionesBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesBuscadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
