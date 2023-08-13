import { Component, OnInit } from '@angular/core';
import { TipoSuscripcionService } from '../../service/tiposSuscripcion.service';
import { TipoSuscripcion } from '../../models/TipoSuscripcion';
import { PayPalScriptService } from 'ngx-paypal';
import { PayPalService } from '../../service/paypal.service';
import { PayPal } from '../../models/PayPal';
declare var $: any;

@Component({
  selector: 'app-suscripcion-ficha',
  templateUrl: './suscripcion-ficha.component.html',
  styleUrls: ['./suscripcion-ficha.component.css']
})
export class SuscripcionFichaComponent implements OnInit {
  suscripciones: TipoSuscripcion[] = [];
  numeroValido: boolean = true;
  precioVino: string = "";
  clientIdPayPal: string = "";

  constructor(private tiposSuscripcionService: TipoSuscripcionService,
    private payPalService: PayPalService) {

  }

  ngOnInit(): void {
    this.getPayPal();
    this.getSuscripciones();

  }

  getSuscripciones(){
    this.tiposSuscripcionService.getTiposSuscripcion().subscribe(tipos=>{
      this.suscripciones = tipos;
      this.suscripciones.forEach(suscripcion => {
        suscripcion.id =  this.tiposSuscripcionService.getId(suscripcion);
      });
    })
  }

  patchTipoSuscripcions() {
    this.suscripciones.forEach(tipoSuscripcion => {
      this.tiposSuscripcionService.patchTipoSuscripcion(tipoSuscripcion).subscribe(response=>{
        $('#modificadaSuscripcionModal').modal('show');
      }, err=>{
        $('#errorModificarSuscripcionModal').modal('show');
      });
    });
  }

  soloNumeros(event: KeyboardEvent, suscripcion: number): void {
    const input = event.target as HTMLInputElement;
    const charCode = event.charCode;
    const char = String.fromCharCode(charCode);
    const regex = /^[0-9]+(\.[0-9]*)?$/; // Expresión regular para números enteros o con decimales
  
    if (!regex.test(input.value + char)) {
      event.preventDefault();
      this.mostrarMensajeError(suscripcion);
    } else {
      this.ocultarMensajeError(suscripcion);
    }
  }
  
  mostrarMensajeError(suscripcion: number): void {
    const mensajeError = document.getElementById("mensajeError" + suscripcion);
    if (mensajeError) {
      mensajeError.style.display = "block";
    }
  }
  
  ocultarMensajeError(suscripcion: number): void {
    const mensajeError = document.getElementById("mensajeError" + suscripcion);
    if (mensajeError) {
      mensajeError.style.display = "none";
    }
  }

  getPayPal(){
    this.payPalService.getPayPal().subscribe(paypal=>{
      this.clientIdPayPal = paypal.clientId;
      sessionStorage.setItem("ClientId", this.clientIdPayPal);
  })
}

  cambiarPayPal(){
    let payPal = new PayPal();
    payPal.clientId = this.clientIdPayPal;
    this.payPalService.getPayPal().subscribe(paypalAntiguo=>{
      if (paypalAntiguo) {
        this.payPalService.patchPayPal(payPal).subscribe(payPalNuevo=>{

        })
      }else{
        this.payPalService.postPayPal(payPal).subscribe(payPalNuevo=>{

        })
      }
    },err=>{
      this.payPalService.postPayPal(payPal).subscribe(payPalNuevo=>{

      },
      ()=>{
        sessionStorage.setItem("CLIENTID", this.clientIdPayPal);
      })
    })
  }
  
  

}
