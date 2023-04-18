import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seccion } from 'src/app/ecommerce/models/seccion';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css']
})
export class SeccionComponent {
  @Input() seccion: Seccion = new Seccion();
  @Output() eliminarSeccionEvent = new EventEmitter<Seccion>();
  @Output() modificarSeccionEvent = new EventEmitter<Seccion>();

  ngOnInit(): void {
    
  }

  eliminarSeccion(){
    this.eliminarSeccionEvent.emit(this.seccion);
  }
  modificarSeccion(){
    this.modificarSeccionEvent.emit(this.seccion);
  }
}
