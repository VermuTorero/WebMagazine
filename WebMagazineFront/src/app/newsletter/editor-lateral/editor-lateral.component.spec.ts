import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorLateralComponent } from './editor-lateral.component';

describe('EditorLateralComponent', () => {
  let component: EditorLateralComponent;
  let fixture: ComponentFixture<EditorLateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorLateralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
