import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuario } from '../models/usuario';
import { RolesService } from '../service/roles.service';
import { Rol } from 'src/app/newsletter/models/Rol';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Usuario[] = [];
  usuarioNuevo: Usuario = new Usuario();
  usuarioModificar: Usuario = new Usuario();
  usuarioBorrar: Usuario = new Usuario();
  password2: string = "";
  roles: Rol[] = [];

  constructor(private usuariosService: UsuariosService,
    private rolesService: RolesService) {
  }

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();
    let rol = new Rol();
    rol.rolNombre = "";
    this.usuarioNuevo.roles = [rol];
    this.usuarioModificar.roles = [rol];
  }

  getUsuarios() {
    this.usuariosService.getUsuarios().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    })
  }

  getRoles() {
    this.rolesService.getRoles().subscribe(roles => {
      this.roles = roles;
    })
  }

  abrirModificarModal(user: any) {
    this.usuarioModificar = user;
    $('#modificarModal').modal('show');
  }

  patchUsuario() {
    this.usuariosService.patchUsuario(this.usuarioModificar).subscribe(usuario => {
      $('#modificadoUserModal').modal('show');
    }, err => {
      $('#errorModificarUserModal').modal('show');
    })
  }

  deleteUsuario(user: any) {
    this.usuarioBorrar = user;
    $('#confirmarDeleteModal').modal('show');
  }

  deleteUsuarioConfirmado() {
      this.usuariosService.deleteUsuarioAdmin(this.usuarioBorrar).subscribe(user => {
        $('#confirmadoDeleteModal').modal('show');
      }, err => { 
        $('#errorDeleteModal').modal('show');
       })
  }
  
  postUsuario() {
    this.usuariosService.postUsuario(this.usuarioNuevo).subscribe(usuario => {
      console.log("USUARIO CREADO: " + usuario)

    }, err => { }, () => { document.location.reload() })
  }

  postUsuarioAdmin(){
    this.usuariosService.postUsuarioAdmin(this.usuarioNuevo).subscribe(usuario => {
      console.log("USUARIO CREADO: " + usuario)

    }, err => { }, () => { document.location.reload() })
  }
  recargarPagina(){
    document.location.reload();
  }

}
