import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
declare var $: any;
@Component({
  selector: 'app-pass-recovery',
  templateUrl: './pass-recovery.component.html',
  styleUrls: ['./pass-recovery.component.css']
})
export class PassRecoveryComponent {
  email: string ="";
  constructor(private loginService: LoginService){}

  recuperarPassword(){
    this.loginService.passwordRecovery(this.email).subscribe(response=>{
      $('#enviadoRecuperacionModal').modal('show');
    },err=>{
      $('#errorRecuperacionModal').modal('show');
    });
  }
}
