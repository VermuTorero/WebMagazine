import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReceiptComponent } from './modal-receipt.component';

describe('ModalReceiptComponent', () => {
  let component: ModalReceiptComponent;
  let fixture: ComponentFixture<ModalReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
