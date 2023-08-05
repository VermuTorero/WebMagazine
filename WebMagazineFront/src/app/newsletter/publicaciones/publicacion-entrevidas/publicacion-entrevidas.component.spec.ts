import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionEntrevidasComponent } from './publicacion-entrevidas.component';

describe('PublicacionEntrevidasComponent', () => {
  let component: PublicacionEntrevidasComponent;
  let fixture: ComponentFixture<PublicacionEntrevidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionEntrevidasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionEntrevidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
