import { Component, Input, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacion';

@Component({
  selector: 'app-publicacion-restaurante',
  templateUrl: './publicacion-restaurante.component.html',
  styleUrls: ['./publicacion-restaurante.component.css']
})
export class PublicacionRestauranteComponent implements OnInit{
  @Input() publicacion: Publicacion = new Publicacion();
  tituloUrl: string = "";
 
  ngOnInit(): void {

  }
}
