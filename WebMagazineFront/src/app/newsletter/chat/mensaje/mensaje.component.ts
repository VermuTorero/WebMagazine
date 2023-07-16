import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mensaje } from '../../models/Mensaje';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent {
  @Input() mensaje: Mensaje = new Mensaje();
  @Output() eliminarMensajeEvent = new EventEmitter<Mensaje>();

  eliminarMensaje(){
    this.eliminarMensajeEvent.emit(this.mensaje);
  }
}
