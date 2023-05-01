import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditableComponent } from './pagina-editable.component';

describe('PaginaEditableComponent', () => {
  let component: PaginaEditableComponent;
  let fixture: ComponentFixture<PaginaEditableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaEditableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaEditableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
