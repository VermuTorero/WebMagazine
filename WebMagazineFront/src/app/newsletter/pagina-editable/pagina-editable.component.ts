import { Component, OnInit } from '@angular/core';
import { PaginaEditableService } from '../service/paginaEditable.service';
import { PaginaEditable } from '../models/PaginaEditable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagina-editable',
  templateUrl: './pagina-editable.component.html',
  styleUrls: ['./pagina-editable.component.css']
})
export class PaginaEditableComponent implements OnInit {
nombrePagina: string = "";


paginaEditable: PaginaEditable = new PaginaEditable();

constructor(private paginaEditableService: PaginaEditableService,
  private activatedRoute: ActivatedRoute){
}

  ngOnInit(): void {
    this.getNombrePagina();
    this.getPaginaEditable();
  }

  getNombrePagina(): void {
    this.activatedRoute.params.subscribe(params => {
      this.nombrePagina = params['titulo'].replaceAll("-", " ");
    })
  }

  getPaginaEditable(){
    this.paginaEditableService.getPaginaEditable(this.nombrePagina).subscribe(paginaEditable=>{
      paginaEditable.id = this.paginaEditableService.getId(paginaEditable);
      this.paginaEditable = paginaEditable;

      /*Formato de los videos de Youtube*/
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('<iframe class="ql-video ql-align-center" frameborder="0" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video"allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');
      
      /*Formato de los podcast de Spotify*/
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('<iframe style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('<iframe class="ql-video ql-align-center" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      
      /* Cierre de iframe comun para Youtube y Spotify */
       this.paginaEditable.html = this.paginaEditable.html.replaceAll('</iframe>', '</iframe></div>');
      
       /*Centrar imagenes y meterlas en un imagen-container*/
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('<p class="ql-align-center"><img src="', '<p class="ql-align-center imagen-container text-center"><img src="')
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('alt="imagenAlt100">', 'alt="imagenAlt100"></p>');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('alt="imagenAlt75">', 'alt="imagenAlt75"></p>');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('alt="imagenAlt50">', 'alt="imagenAlt50"></p>');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('alt="imagenAlt35">', 'alt="imagenAlt35"></p>');
      this.paginaEditable.html = this.paginaEditable.html.replaceAll('alt="imagenAlt20">', 'alt="imagenAlt20"></p>');

      this.showPublicacion();
    })
  }
  showPublicacion() {
    var body = document.querySelector("#body");
    var html = document.createElement("div");
    /* html.setAttribute("class", "d-flex"); */
    html.innerHTML = this.paginaEditable.html;
    body?.appendChild(html)
  }

}
