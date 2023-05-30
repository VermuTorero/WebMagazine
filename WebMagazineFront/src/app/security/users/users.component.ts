import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuario } from '../models/usuario';
import { RolesService } from '../service/roles.service';
import { Rol } from 'src/app/newsletter/models/Rol';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Usuario[] = [];
  usuarioNuevo: Usuario = new Usuario();
  password2: string = "";

  constructor(private usuariosService: UsuariosService,
    private rolesService: RolesService) {

  }
  ngOnInit(): void {
    this.getUsuarios();
    let rol = new Rol();
    rol.rolNombre = "";
    this.usuarioNuevo.roles = [rol];
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles=>{
          user.roles = roles;
        })
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
