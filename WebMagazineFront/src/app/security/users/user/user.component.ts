import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Usuario } from 'src/app/newsletter/models/usuario';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() user: Usuario = new Usuario();
  @Output() eliminarUserEvent = new EventEmitter<Usuario>();
  @Output() modificarUserEvent = new EventEmitter<Usuario>();

  modificarUsuario(){
    this.modificarUserEvent.emit(this.user);
  }

  eliminarUsuario(){
    this.eliminarUserEvent.emit(this.user);
  }
}
