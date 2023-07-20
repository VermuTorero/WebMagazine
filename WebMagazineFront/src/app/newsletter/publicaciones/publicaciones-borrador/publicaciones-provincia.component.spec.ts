import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesProvinciaComponent } from './publicaciones-provincia.component';

describe('PublicacionesProvinciaComponent', () => {
  let component: PublicacionesProvinciaComponent;
  let fixture: ComponentFixture<PublicacionesProvinciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesProvinciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesProvinciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
