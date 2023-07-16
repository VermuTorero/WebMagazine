import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mensaje } from '../../models/Mensaje';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit{
  @Input() mensaje: Mensaje = new Mensaje();
  @Output() eliminarMensajeEvent = new EventEmitter<Mensaje>();
  hora: string ="";
  fecha: string = "";

  ngOnInit(): void {
    this.fecha = this.mensaje.fecha.split('T')[0];
    this.hora = this.mensaje.fecha.split('T')[1];

    this.hora = this.hora.split(':')[0] + ":" + this.hora.split(':')[0]
  }
  eliminarMensaje(){
    this.eliminarMensajeEvent.emit(this.mensaje);
  }
}
