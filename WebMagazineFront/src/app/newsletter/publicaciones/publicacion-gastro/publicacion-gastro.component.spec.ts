import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionGastroComponent } from './publicacion-gastro.component';

describe('PublicacionGastroComponent', () => {
  let component: PublicacionGastroComponent;
  let fixture: ComponentFixture<PublicacionGastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionGastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionGastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
