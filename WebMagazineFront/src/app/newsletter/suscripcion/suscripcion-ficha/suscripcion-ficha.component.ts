import { Component, OnInit } from '@angular/core';
import { TipoSuscripcionService } from '../../service/tiposSuscripcion.service';
import { TipoSuscripcion } from '../../models/TipoSuscripcion';

@Component({
  selector: 'app-suscripcion-ficha',
  templateUrl: './suscripcion-ficha.component.html',
  styleUrls: ['./suscripcion-ficha.component.css']
})
export class SuscripcionFichaComponent implements OnInit {
  tipoSuscripcions: TipoSuscripcion[] = [];

  constructor(private tipoSuscripcionService: TipoSuscripcionService) {

  }

  ngOnInit(): void {
    this.getTipoSuscripciones();

  }

  getTipoSuscripciones() {
    this.tipoSuscripcionService.getTiposSuscripcion().subscribe(tiposuscripcions => {
      this.tipoSuscripcions = tiposuscripcions;
      console.log("TIPO SUSCRIPCIONES", this.tipoSuscripcions)
      this.tipoSuscripcions.forEach(tipoSuscripcion => {
        tipoSuscripcion.id = this.tipoSuscripcionService.getId(tipoSuscripcion);
        this.tipoSuscripcionService.getCaracteristicasFromSuscripcion(tipoSuscripcion).subscribe(caracteristicas=>{
          tipoSuscripcion.caracteristicas = caracteristicas;
          console.log("CARACTERISTICAS DE " + tipoSuscripcion.nombre, caracteristicas)
        })
      });
    })
  }

  patchTipoSuscripcions() {
    this.tipoSuscripcions.forEach(tipoSuscripcion => {
      this.tipoSuscripcionService.patchTipoSuscripcion(tipoSuscripcion).subscribe();
    });
  }
}
