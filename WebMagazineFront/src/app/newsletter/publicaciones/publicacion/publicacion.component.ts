import { Component, Input } from '@angular/core';
import { Publicacion } from '../../models/publicacion';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent {
  @Input() publicacion: Publicacion = new Publicacion();
}
