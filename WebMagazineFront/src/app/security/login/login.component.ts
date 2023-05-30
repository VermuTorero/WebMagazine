import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { TokenService } from '../service/token.service';
import { UsuariosService } from '../service/usuarios.service';
import { Usuario } from '../models/usuario';
import { RolesService } from '../service/roles.service';
const ROLE_KEY = "rol";
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  userLogged$: any;
  isLoggedUser: any;
  isLoggedAdmin: any;
  email: string = "";
  password: string = "";
  usuario: Usuario = new Usuario();
  usuarioNuevo: Usuario = new Usuario();
  password2: string = "";
  rolNombreSeleccionado: string = "";

  constructor(private loginService: LoginService,
    private tokenService: TokenService,
    private usuariosService: UsuariosService,
    private rolesService: RolesService) {
  }

  ngOnInit(): void {

    this.getUsuario();
    this.getFlags();
    
  }

  getFlags() {
    this.loginService.getIsLoggedFlagObs().subscribe((flag) => {
      this.isLoggedUser = flag;
    });
    this.loginService.getIsAdminFlagObs().subscribe((flag) => {
      this.isLoggedAdmin = flag;
    });
  }

  getUsuario() {
    let email = sessionStorage.getItem('email');
    if (email !== null) {
      this.usuariosService.getUsuarioFromEmail(email).subscribe(usuario => {
        usuario.id = this.usuariosService.getId(usuario);
        this.rolesService.getRolesFromUsuario(usuario).subscribe(roles=>{
          usuario.roles = roles;
          this.usuario = usuario;
        })
        
      })
    }
  }

  login() {
    this.loginService.login(this.email, this.password).subscribe(tokenDTO => {
      console.log("TOKEN RECIBIDO", tokenDTO.token);
      this.tokenService.setToken(tokenDTO.token);
      this.usuariosService.getUsuarioFromToken().subscribe(usuario => {
        console.log("USUARIO FROM TOKEN:", usuario)
        usuario.id = this.usuariosService.getId(usuario);
        this.rolesService.getRolesFromUsuario(usuario).subscribe(roles=>{
          usuario.roles = roles;
          this.usuariosService.setUser(this.email);
        this.usuariosService.setRol(usuario.roles[0].rolNombre);
        this.loginService.setIsLoggedFlagObs(true);
        if (usuario.roles[0].rolNombre == "ROLE_ADMIN") {
          this.loginService.setIAdminFlagObs(true);
        }
        this.usuario = usuario;
        console.log("USUARIO LOGGEADO: ", this.usuario.nombre);
       /* document.location.reload(); */
        });
        
      })
    })
  }

  signIn() {
    this.usuarioNuevo.roles[0].rolNombre = this.rolNombreSeleccionado;
    this.loginService.signin(this.usuarioNuevo).subscribe(usuario => {
    });
  }

  exitLogin() {
    this.usuario = new Usuario();
    this.loginService.setIAdminFlagObs(false);
    this.loginService.setIsLoggedFlagObs(false);
    sessionStorage.removeItem("AuthToken");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("email");
    document.location.reload();
  }
}
