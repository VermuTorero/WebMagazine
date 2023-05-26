import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from 'src/app/newsletter/models/usuario';
import { LoginService } from 'src/app/security/service/login.service';
import { TokenService } from 'src/app/security/service/token.service';
const ROLE_KEY = "rol";
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  userLogged$: any;
  isLoggedUser: any;
  isLoggedAdmin: any;
  
  constructor(private loginService: LoginService){
  }

  ngOnInit(): void {
    this.loginService.getIsLoggedFlagObs().subscribe((flag) => {
      this.isLoggedUser = flag;
    });
     this.loginService.getIsAdminFlagObs().subscribe((flag) => {
      this.isLoggedAdmin = flag;
    });
  }
}
