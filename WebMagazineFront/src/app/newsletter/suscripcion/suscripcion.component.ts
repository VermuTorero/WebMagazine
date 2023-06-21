import { Component, OnInit } from '@angular/core';
import { TipoSuscripcion } from '../models/TipoSuscripcion';
import { TipoSuscripcionService } from '../service/tiposSuscripcion.service';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {

  suscripciones: TipoSuscripcion[] = [];

  constructor( private tiposSuscripcionService: TipoSuscripcionService){

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
}
