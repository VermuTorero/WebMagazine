import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seccion } from '../../models/seccion';
import { SeccionService } from '../../service/seccion.service';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.css'],
})
export class SeccionesComponent {
  secciones: Seccion[] = [];
  seccionNueva: Seccion = new Seccion();

  constructor(private seccionService: SeccionService) {}
  ngOnInit(): void {
    this.getSecciones();
  }

  getSecciones() {
    this.seccionService.getSecciones().subscribe((secciones) => {
      this.secciones = secciones;
      this.secciones.forEach((seccion) => {
        seccion.id = this.seccionService.getId(seccion);
      });
    });
  }
  modificarSeccion(seccion: any) {
    this.seccionService.patchSeccion(seccion).subscribe((response) => {
      this.getSecciones();
    });
  }
  eliminarSeccion(seccion: any) {
    this.seccionService.deleteSeccion(seccion).subscribe((response) => {
      this.getSecciones();
    });
  }
  nuevaSeccion() {
    this.seccionService.postSeccion(this.seccionNueva).subscribe((response) => {
      this.getSecciones();
      this.seccionNueva.seccionNombre = '';
    });
  }
}
