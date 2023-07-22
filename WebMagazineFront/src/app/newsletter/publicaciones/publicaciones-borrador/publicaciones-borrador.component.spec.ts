import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesBorradorComponent } from './publicaciones-borrador.component';

describe('PublicacionesBorradorComponent', () => {
  let component: PublicacionesBorradorComponent;
  let fixture: ComponentFixture<PublicacionesBorradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesBorradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesBorradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
