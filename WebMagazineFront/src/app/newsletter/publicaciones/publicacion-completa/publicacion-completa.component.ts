import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { AutoresServiceService } from '../../service/autores.service';
import { TagsServiceService } from '../../service/tags.service';

@Component({
  selector: 'app-publicacion-completa',
  templateUrl: './publicacion-completa.component.html',
  styleUrls: ['./publicacion-completa.component.css']
})
export class PublicacionCompletaComponent implements OnInit {

  publicacion: Publicacion = new Publicacion();
  id: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private autoresService: AutoresServiceService,
    private tagsService: TagsServiceService,
    private router: Router) { }

  ngOnInit(): void {
    this.getId();
    this.getPublicacion();
    
  }

  getId(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    })
  }
  getPublicacion(): void {

    this.publicacionesService.getPublicacion(this.id).subscribe(publicacion => {
      console.log("PUBLICACION RECIBIDA", publicacion)
      this.publicacion = publicacion;
      this.publicacion.id = this.id;
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
        this.publicacion.autor = autor;
      })
      this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
        this.publicacion.tags = tags;
        console.log("TAGS: ", this.publicacion.tags)
      })
      console.log(this.publicacion);
      
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('width="100%" height="352"', 'width="80%" height="200"');
      /*Formato de los videos de Youtube*/
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" style="width:85%; height: 35vw" allowfullscreen="true" src="https://www.youtube.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" style="width:85%; height: 35vw" allowfullscreen="true" src="https://www.youtube.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="iframe" width="560" height="315" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" style="width:85%; height: 35vw" allowfullscreen="true" src="https://www.youtube.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="iframe ql-align-center" width="560" height="315" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" style="width:85%; height: 35vw" allowfullscreen="true" src="https://www.youtube.com');
      /*Formato de los podcast de Spotify*/
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container text-center w-75"><iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-align-center" style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container text-center w-75"><iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container text-center w-75"><iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container text-center"><iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com');
       /* Cierre de iframe comun para Youtube y Spotify */
       this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('</iframe>', '</iframe></div>');
      /*Formato de las imagenes*/
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<img src="', '<div class="imagen-container text-center"><img class="imagen" style="width:100%" src="')
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('alt="imagenAlt">', 'alt="imagenAlt"></div>');
      /* Centrar en Bootstrap */
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('ql-align-justify', 'justify-content-between');
      console.log(this.publicacion.htmlPublicacion)
      this.showPublicacion();
    })
  }

  showPublicacion() {
    var body = document.querySelector("#body");
    var html = document.createElement("div");
    /* html.setAttribute("class", "d-flex"); */
    html.innerHTML = this.publicacion.htmlPublicacion;
    body?.appendChild(html)
  }

  eliminarPublicacion(){
    this.publicacionesService.deletePublicacion(this.publicacion.id).subscribe(response=>{
      this.router.navigate(['#'])
    });
  }


}
