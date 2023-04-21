import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seccion } from 'src/app/ecommerce/models/seccion';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css']
})
export class SeccionComponent {

  seccionSinModificar = new Seccion();
  @Input() seccion: Seccion = new Seccion();
  @Output() eliminarSeccionEvent = new EventEmitter<Seccion>();
  @Output() modificarSeccionEvent = new EventEmitter<Seccion>();
 

  ngOnInit(): void {
    this.seccionSinModificar = this.seccion;
  }

  eliminarSeccion(){
    this.eliminarSeccionEvent.emit(this.seccion);
  }
  modificarSeccion(){
    this.modificarSeccionEvent.emit(this.seccion);
  }

}
