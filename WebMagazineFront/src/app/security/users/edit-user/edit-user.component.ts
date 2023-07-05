import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../service/usuarios.service';
import { RolesService } from '../../service/roles.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  usuario: Usuario = new Usuario();
  rolNombreSeleccionado: string = "";
  password2: string = "";

  constructor(private usuariosService: UsuariosService, private rolesService: RolesService) {

  }

  ngOnInit(): void {
    this.getUsuarioFromToken();
  }
  getUsuarioFromToken() {
    this.usuariosService.getUsuarioFromToken().subscribe(usuario => {
      usuario.id = this.usuariosService.getId(usuario);
      this.usuario = usuario;
      this.rolesService.getRolesFromUsuario(this.usuario).subscribe(roles => {
        this.usuario.roles = roles;
        console.log("USUARIO: " + this.usuario.roles[0].rolNombre)
      })
    })
  }

  patchUsuario() {
    if(this.usuario.password == this.password2 && this.usuario.password != null && this.usuario.password != undefined && this.usuario.password != ""){
      this.usuariosService.cambiarPassword(this.usuario).subscribe();
    }
    this.usuariosService.patchUsuarioRenovado(this.usuario).subscribe(usuario => {
      usuario.id = this.usuariosService.getId(usuario);
      this.usuario = usuario;
    })
  }
}
