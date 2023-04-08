import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionCompletaComponent } from './publicacion-completa.component';

describe('PublicacionCompletaComponent', () => {
  let component: PublicacionCompletaComponent;
  let fixture: ComponentFixture<PublicacionCompletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionCompletaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionCompletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
