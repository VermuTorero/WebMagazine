import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuario } from '../../models/usuario';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{
  @Input() user: Usuario = new Usuario();
  @Output() eliminarUserEvent = new EventEmitter<Usuario>();
  @Output() modificarUserEvent = new EventEmitter<Usuario>();

  ngOnInit(): void {
    this.user.fechaFinSuscripcion = this.user.fechaFinSuscripcion.split("T")[0];
  }
  modificarUsuario(){
    this.modificarUserEvent.emit(this.user);
  }

  eliminarUsuario(){
    this.eliminarUserEvent.emit(this.user);
    /* document.location.reload(); */
  }
}
