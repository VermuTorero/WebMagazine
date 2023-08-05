import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Publicacion } from '../../models/publicacion';

@Component({
  selector: 'app-publicacion-entrevidas',
  templateUrl: './publicacion-entrevidas.component.html',
  styleUrls: ['./publicacion-entrevidas.component.css']
})
export class PublicacionEntrevidasComponent implements OnInit{
  @Input() publicacion: Publicacion = new Publicacion();
  @Output() abrirPublicacionEvent = new EventEmitter<Publicacion>();
  tituloUrl: string = "";
  isClicked: boolean = false;
 
  ngOnInit(): void {

  }

  abrirPublicacion(){
    this.abrirPublicacionEvent.emit(this.publicacion);

  }

}
