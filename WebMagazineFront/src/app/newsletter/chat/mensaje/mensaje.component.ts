import { Component, Input } from '@angular/core';
import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent {
  @Input() mensaje: Mensaje = new Mensaje();


}
