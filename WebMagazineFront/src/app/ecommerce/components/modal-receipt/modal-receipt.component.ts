import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-receipt',
  templateUrl: './modal-receipt.component.html',
  styleUrls: ['./modal-receipt.component.css']
})
export class ModalReceiptComponent {


@Input() amount: any;
@Input() items: any;

constructor( public activeModal: NgbActiveModal){
}
}
