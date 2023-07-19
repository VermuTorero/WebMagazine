import { Component, Input, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacion';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit{
  @Input() publicacion: Publicacion = new Publicacion();
  tituloUrl: string = "";
 
  ngOnInit(): void {

  }
}
