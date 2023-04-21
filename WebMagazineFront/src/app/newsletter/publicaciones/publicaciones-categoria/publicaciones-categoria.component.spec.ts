import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesCategoriaComponent } from './publicaciones-categoria.component';

describe('PublicacionesCategoriaComponent', () => {
  let component: PublicacionesCategoriaComponent;
  let fixture: ComponentFixture<PublicacionesCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesCategoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
