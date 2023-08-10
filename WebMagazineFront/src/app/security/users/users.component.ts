import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { Usuario } from '../models/usuario';
import { RolesService } from '../service/roles.service';
import { Rol } from 'src/app/newsletter/models/Rol';
import * as saveAs from 'file-saver';
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
  rolSeleccionado: string = "";
  emailsSeleccionados: string = "";

  constructor(private usuariosService: UsuariosService,
    private rolesService: RolesService) {
  }

  ngOnInit(): void {
    this.getRoles();
    let rol = new Rol();
    rol.rolNombre = "";
    this.usuarioNuevo.roles = [rol];
    this.usuarioModificar.roles = [rol];
    this.getUsuarios();
  }

  getUsuarios() {
    this.rolSeleccionado = "ROLE_ALL";
    this.usuariosService.getUsuarios().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosAdmin() {
    this.rolSeleccionado = "ROLE_ADMIN";
    this.usuariosService.getUsuariosAdmin().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosWriter() {
    this.rolSeleccionado = "ROLE_WRITER";
    this.usuariosService.getUsuariosWriter().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosMember() {
    this.rolSeleccionado = "ROLE_USER_MEMBER";
    this.usuariosService.getUsuariosMember().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosSubscribed() {
    this.rolSeleccionado = "ROLE_USER_SUBSCRIBED";
    this.usuariosService.getUsuariosSuscritos().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosRegistered() {
    this.rolSeleccionado = "ROLE_USER_REGISTERED";
    this.usuariosService.getUsuariosRegistrados().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosNotRegistered() {
    this.rolSeleccionado = "ROLE_USER_NOT_REGISTERED";
    this.usuariosService.getUsuariosNotRegistered().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosExpired() {
    this.rolSeleccionado = "ROLE_EXPIRED";
    this.usuariosService.getUsuariosExpired().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
    })
  }

  getUsuariosDeleted() {
    this.rolSeleccionado = "ROLE_DELETED";
    this.usuariosService.getUsuariosDeleted().subscribe(users => {
      this.users = users;
      this.users.forEach(user => {
        user.id = this.usuariosService.getId(user);
        this.rolesService.getRolesFromUsuario(user).subscribe(roles => {
          user.roles = roles;
        })
      });
    }, err=>{
      this.users = [];
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

  seleccionarEmails(){
    this.emailsSeleccionados = "";
    this.users.forEach(user => {
      if (this.emailsSeleccionados == "") {
        this.emailsSeleccionados = user.email;
      }else{
        this.emailsSeleccionados = this.emailsSeleccionados + ";" + user.email;
      }
    
      this.copiarAlPortapapeles(this.emailsSeleccionados);
      $('#copiadosModal').modal('show');
    });
  }
  copiarAlPortapapeles(texto: string) {
    // Crea un elemento de textarea temporal
    var elementoTemporal = document.createElement('textarea');
    elementoTemporal.value = texto;
  
    // Agrega el elemento temporal al documento
    document.body.appendChild(elementoTemporal);
  
    // Selecciona el texto del elemento temporal
    elementoTemporal.select();
  
    // Copia el texto al portapapeles
    document.execCommand('copy');
  
    // Elimina el elemento temporal
    document.body.removeChild(elementoTemporal);
  }

  downloadCSV(): void {
    const csvContent = "data:text/csv;charset=utf-8," +
      "email,nombre,apellido1,apellido2\n" +
      this.users.map(user => `${user.email},${user.nombre},${user.apellido1},${user.apellido2}`).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
