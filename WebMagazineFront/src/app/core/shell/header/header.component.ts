import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/security/service/login.service';
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
  isLoggedMember: any;
  isLoggedAdmin: any;
  isLoggedWriter: any;
  public isCollapsed = true;  


  constructor(private loginService: LoginService){
  }

  ngOnInit(): void {
    this.loginService.getIsLoggedFlagObs().subscribe((flag) => {
      this.isLoggedUser = flag;
    });
    this.loginService.getIsMemberFlagObs().subscribe((flag) => {
      this.isLoggedMember = flag;
    });
     this.loginService.getIsAdminFlagObs().subscribe((flag) => {
      this.isLoggedAdmin = flag;
    });
    this.loginService.getIsWriterFlagObs().subscribe((flag) => {
      this.isLoggedWriter = flag;
    });
  }

  getMeta(){

  }
}
