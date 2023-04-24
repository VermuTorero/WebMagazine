import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorInicioComponent } from './editor-inicio.component';

describe('EditorInicioComponent', () => {
  let component: EditorInicioComponent;
  let fixture: ComponentFixture<EditorInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorInicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
