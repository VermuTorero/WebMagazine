import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Publicacion } from '../../models/publicacion';

@Component({
  selector: 'app-publicacion-gastro',
  templateUrl: './publicacion-gastro.component.html',
  styleUrls: ['./publicacion-gastro.component.css']
})
export class PublicacionGastroComponent implements OnInit{
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
