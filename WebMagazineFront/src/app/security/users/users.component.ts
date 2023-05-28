import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/newsletter/models/usuario';
import { UsuariosService } from '../service/usuarios.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Usuario[] = [];

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
      this.ngOnInit();
    })
  }
  
}
