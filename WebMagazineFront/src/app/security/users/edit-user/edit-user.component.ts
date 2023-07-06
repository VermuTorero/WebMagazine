import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../service/usuarios.service';
import { RolesService } from '../../service/roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { TokenService } from '../../service/token.service';
import { Rol } from 'src/app/newsletter/models/Rol';
declare var $: any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  usuario: Usuario = new Usuario();
  rol: Rol = new Rol();
  roles: Rol[] = [this.rol];
  rolNombreSeleccionado: string = "";
  password2: string = "";
  claveRecuperacion: string | null = "";
  email: string | null="";

  constructor(private usuariosService: UsuariosService, private loginService: LoginService,
     private tokenService: TokenService,private rolesService: RolesService, 
     private activatedRoute: ActivatedRoute, private router: Router) {
  }
  ngOnInit(): void {
    this.usuario.roles = this.roles;
    var params = new URLSearchParams(window.location.search);
    this.claveRecuperacion = params.get('claveRecuperacion');
    this.email = params.get('email');
    if (this.claveRecuperacion == undefined) {
      this.getUsuarioFromToken();
    }else{
      this.getUsuarioFromClaveRecuperacion();
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
      $('#modificadoModal').modal('show');
    })
  }
}
