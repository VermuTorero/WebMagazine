import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../models/mensaje';
import { MensajesService } from '../service/mensajes.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  mensajeNuevo: string = "";

  constructor(private mensajeService: MensajesService,
    private usuarioService: UsuariosService){

  }

  mensajes: Mensaje[] = [];

  ngOnInit(): void {
   this.getMensajes();
  }
  getMensajes(){
    this.mensajeService.getMensajes().subscribe(mensajes=>{
      this.mensajes = mensajes;
      this.mensajes.forEach(mensaje => {
        mensaje.id = this.mensajeService.getId(mensaje);
        mensaje.usuario.id = this.usuarioService.getId(mensaje.usuario);
        this.usuarioService.getUsuarioFromId(mensaje.usuario.id).subscribe(usuario=>{
          usuario.id = this.usuarioService.getId(usuario);
          mensaje.usuario = usuario;
        })
      });
    })
  }
  postMensaje(){
    let mensaje = new Mensaje();
    this.usuarioService.getUsuarioFromToken().subscribe(usuario=>{
      usuario.id = this.usuarioService.getId(usuario);
      mensaje.usuario = usuario;
      mensaje.texto = this.mensajeNuevo;
      this.mensajeService.postMensaje(mensaje).subscribe(mensaje=>{
        this.getMensajes();
      })
    });

  }
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.postMensaje();
    }
  }
}
