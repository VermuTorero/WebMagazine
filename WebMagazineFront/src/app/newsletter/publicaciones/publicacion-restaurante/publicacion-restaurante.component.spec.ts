import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionRestauranteComponent } from './publicacion-restaurante.component';

describe('PublicacionComponent', () => {
  let component: PublicacionRestauranteComponent;
  let fixture: ComponentFixture<PublicacionRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionRestauranteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
