import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesTagComponent } from './publicaciones-tag.component';

describe('PublicacionesTagComponent', () => {
  let component: PublicacionesTagComponent;
  let fixture: ComponentFixture<PublicacionesTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
