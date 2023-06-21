import { Component, OnInit } from '@angular/core';
import { TipoSuscripcionService } from '../../service/tiposSuscripcion.service';
import { TipoSuscripcion } from '../../models/TipoSuscripcion';

@Component({
  selector: 'app-suscripcion-ficha',
  templateUrl: './suscripcion-ficha.component.html',
  styleUrls: ['./suscripcion-ficha.component.css']
})
export class SuscripcionFichaComponent implements OnInit {
  suscripciones: TipoSuscripcion[] = [];

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
      this.tiposSuscripcionService.patchTipoSuscripcion(tipoSuscripcion).subscribe();
    });
  }
}
