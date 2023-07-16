import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mensaje } from '../../models/Mensaje';
import { LoginService } from 'src/app/security/service/login.service';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent implements OnInit{
  @Input() mensaje: Mensaje = new Mensaje();
  @Output() eliminarMensajeEvent = new EventEmitter<Mensaje>();
  fechaHoraMensaje: string = "";
  hora: string ="";
  horas: number = 0;
  minutos: string = "";
  fecha: string = "";
  isLoggedAdmin: any;

  constructor(private loginService: LoginService){

  }

  ngOnInit(): void {
    if (this.esMismoDia(this.mensaje.fecha)) {
      this.hora = this.mensaje.fecha.split('T')[1];
      this.horas = parseInt(this.hora.split(':')[0]) + 2;
      this.minutos = this.hora.split(':')[1];
      this.fechaHoraMensaje =this.horas + ":" + this.minutos;
    }else{
      this.fechaHoraMensaje = this.mensaje.fecha.split('T')[0];
    }

     this.loginService.getIsAdminFlagObs().subscribe((flag) => {
      this.isLoggedAdmin = flag;
    });

  }
  eliminarMensaje(){
    this.eliminarMensajeEvent.emit(this.mensaje);
  }
  esMismoDia(fechaString: string) : boolean{
    // Obtener la fecha actual
    var fechaActual = new Date();
    
    // Convertir la fecha en formato ISO 8601 a objeto Date
    var fecha = new Date(fechaString);
    
    // Verificar si el año, mes y día son iguales
    if (
      fecha.getUTCFullYear() === fechaActual.getUTCFullYear() &&
      fecha.getUTCMonth() === fechaActual.getUTCMonth() &&
      fecha.getUTCDate() === fechaActual.getUTCDate()
    ) {
      return true;
    } else {
      return false;
    }
  }
  
}
