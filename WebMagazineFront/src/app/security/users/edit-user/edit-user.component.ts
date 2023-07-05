import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../service/usuarios.service';
import { RolesService } from '../../service/roles.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  usuario: Usuario = new Usuario();
  rolNombreSeleccionado: string = "";
  password2: string = "";
  claveRecuperacion: string = "";
  email: string ="";

  constructor(private usuariosService: UsuariosService, private loginService: LoginService, private tokenService: TokenService,private rolesService: RolesService, private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.claveRecuperacion = params['claveRecuperacion'];
      this.email = params['email'];
    })
    if (this.claveRecuperacion!="" && this.claveRecuperacion!= undefined && this.claveRecuperacion!= null) {
      this.getUsuarioFromClaveRecuperacion();
    }else{
      this.getUsuarioFromToken();
    }
    
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
  getUsuarioFromClaveRecuperacion(){
    this.loginService.getTokenFromClaveRecuperacion(this.claveRecuperacion, this.email).subscribe(token=>{
      this.tokenService.setToken(token);
      this.getUsuarioFromToken();
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
