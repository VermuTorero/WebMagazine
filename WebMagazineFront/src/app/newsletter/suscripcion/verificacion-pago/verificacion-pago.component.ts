import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/security/service/usuarios.service';


@Component({
  selector: 'app-verificacion-pago',
  templateUrl: './verificacion-pago.component.html',
  styleUrls: ['./verificacion-pago.component.css']
})
export class VerificacionPagoComponent implements OnInit{

   

  constructor(private usuariosService: UsuariosService){

  }

  ngOnInit(): void {
    
  }

  comprobarVerificacion(): boolean{
    return false;

  }

}
