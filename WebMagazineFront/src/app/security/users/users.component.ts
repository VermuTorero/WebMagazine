import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Usuario[] = [];
  usuarioNuevo: Usuario = new Usuario();
  password2: string = "";

  constructor(private usuariosService: UsuariosService) {

  }
  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
      });
    })
  }
  patchUsuario(user: any){
    this.usuariosService.patchUsuario(user).subscribe(usuario=>{
      document.location.reload();
    })
  }
  deleteUsuario(user: any){
    this.usuariosService.deleteUsuario(user).subscribe(response=>{
      document.location.reload();
    })
  }
  postUsuario(){
    this.usuariosService.postUsuario(this.usuarioNuevo).subscribe(usuario=>{
      console.log("USUARIO CREADO: " + usuario)
     /* document.location.reload(); */
    })
  }
  
}
