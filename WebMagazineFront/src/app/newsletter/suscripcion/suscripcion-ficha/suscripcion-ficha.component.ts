import { Component, OnInit } from '@angular/core';
import { TipoSuscripcionService } from '../../service/tiposSuscripcion.service';
import { TipoSuscripcion } from '../../models/TipoSuscripcion';
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

  constructor(private tiposSuscripcionService: TipoSuscripcionService) {

  }

  ngOnInit(): void {
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
  
  

}
