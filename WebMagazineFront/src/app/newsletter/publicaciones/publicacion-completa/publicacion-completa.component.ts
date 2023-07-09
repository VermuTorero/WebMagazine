import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { LugaresServiceService } from '../../service/lugares.service';
import { TagsServiceService } from '../../service/tags.service';
import { CategoriasServiceService } from '../../service/categorias.service';
import { Lateral } from '../../models/lateral';
import { LateralServiceService } from '../../service/lateral.service';
declare const twttr: any;

@Component({
  selector: 'app-publicacion-completa',
  templateUrl: './publicacion-completa.component.html',
  styleUrls: ['./publicacion-completa.component.css']
})
export class PublicacionCompletaComponent implements OnInit {

  publicacion: Publicacion = new Publicacion();
  titulo: string = "";
  id: string = "";
  publicacionesCerca: Publicacion[] = [];
  publicacionesRelacionadas: Publicacion[] = [];
  fechaFormateada: string = "";
  lateral: Lateral = new Lateral();
  palabrasClave: string = "";
  rol : string | null= "";
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicacionesService: PublicacionesServiceService,
    private lugarService: LugaresServiceService,
    private tagService: TagsServiceService,
    private categoriaService: CategoriasServiceService,
    private router: Router,
    private lateralService: LateralServiceService) { }

  ngOnInit(): void {
    this.getTitulo();
    this.rol = sessionStorage.getItem("rol");
    if (this.rol == "ROLE_ADMIN" ||this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUBSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      this.getPublicacion();
    }else{
      this.getPublicacionFree();
    }
   
    this.getLateral();
  }

  getTitulo(): void {
    this.activatedRoute.params.subscribe(params => {
      this.titulo = params['titulo'].replaceAll("-", " ");
    })
  }

  getPublicacion(): void {

    this.publicacionesService.getPublicacion(this.titulo).subscribe(publicacion => {
      this.publicacion = publicacion;
      this.getFechaPublicacion();
      this.publicacion.id = this.publicacionesService.getId(publicacion);
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
        this.publicacion.autor = autor;
      })
      this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
        this.publicacion.tags = tags;
        this.publicacion.tags.forEach(tag=> {
          tag.id = this.tagService.getId(tag);
        });
        this.getPublicacionesRelacionadas();
      })
      this.publicacionesService.getLugarFromPublicacion(publicacion).subscribe(lugar=>{
        this.publicacion.lugar = lugar;
        this.publicacion.lugar.id = this.lugarService.getId(lugar);
        this.getPublicacionesCerca();
      })
      this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
        this.publicacion.categoria = categoria;
        this.publicacion.categoria.id = this.categoriaService.getId(categoria);
      })
      
      /*Formato de los videos de Youtube*/
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" frameborder="0" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video"allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://www.youtube.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video" allowfullscreen="true" tipo="youtube" src="https://www.youtube.com');
      
      /*Formato de los podcast de Spotify*/
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe style="border-radius:12px" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video ql-align-center" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<iframe class="ql-video" allowfullscreen="true" src="https://open.spotify.com', '<div class="iframe-container d-flex justify-content-center"><iframe class="ql-video ql-align-center" allowfullscreen="true" tipo="podcast" src="https://open.spotify.com');

      /* Cierre de iframe comun para Youtube y Spotify */
       this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('</iframe>', '</iframe></div>');
      
       /*Centrar imagenes y meterlas en un imagen-container*/
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('<p class="ql-align-center"><img src="', '<p class="ql-align-center imagen-container text-center"><img src="')
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('alt="imagenAlt100">', 'alt="imagenAlt100"></p>');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('alt="imagenAlt75">', 'alt="imagenAlt75"></p>');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('alt="imagenAlt50">', 'alt="imagenAlt50"></p>');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('alt="imagenAlt35">', 'alt="imagenAlt35"></p>');
      this.publicacion.htmlPublicacion = this.publicacion.htmlPublicacion.replaceAll('alt="imagenAlt20">', 'alt="imagenAlt20"></p>');
      this.showPublicacion();
 
      
    })
  }

  getPublicacionFree(){
    this.publicacionesService.getPublicacionFree(this.titulo).subscribe(publicacion => {
      this.publicacion = publicacion;
      this.getFechaPublicacion();
      this.publicacion.id = this.publicacionesService.getId(publicacion);
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
        this.publicacion.autor = autor;
      })
      this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
        this.publicacion.tags = tags;
        this.publicacion.tags.forEach(tag=> {
          tag.id = this.tagService.getId(tag);
        });
        this.getPublicacionesRelacionadas();
      })
      this.publicacionesService.getLugarFromPublicacion(publicacion).subscribe(lugar=>{
        this.publicacion.lugar = lugar;
        this.publicacion.lugar.id = this.lugarService.getId(lugar);
        this.getPublicacionesCerca();
      })
      this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
        this.publicacion.categoria = categoria;
        this.publicacion.categoria.id = this.categoriaService.getId(categoria);
      })
      
      this.showPublicacion();     
    })
  }
  getPublicacionesCerca(){
    this.publicacionesService.getPublicacionesCerca(this.publicacion.lugar.lugarNombre, this.publicacion.id).subscribe(publicacionesCerca=>{
      this.publicacionesCerca = publicacionesCerca;
      this.publicacionesCerca.forEach(publicacionCerca => {
        publicacionCerca.id = this.publicacionesService.getId(publicacionCerca);
        publicacionCerca.subtitulo = publicacionCerca.subtitulo.substring(0,120) + "...";
        this.publicacionesService.getCategoriaFromPublicacion(publicacionCerca).subscribe(categoria=>{
          publicacionCerca.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacionCerca).subscribe(autor=>{
            publicacionCerca.autor = autor;
          })
        })
      });
    })
  }

  getPublicacionesRelacionadas(){
    this.publicacionesService.getPublicacionesRelacionadas(this.publicacion.id).subscribe(publicacionesRelacionadas=>{
      this.publicacionesRelacionadas= publicacionesRelacionadas;
      this.publicacionesRelacionadas.forEach(publicacionRelacionada => {
        publicacionRelacionada.id = this.publicacionesService.getId(publicacionRelacionada);
        publicacionRelacionada.subtitulo = publicacionRelacionada.subtitulo.substring(0,120) + "...";
        this.publicacionesService.getCategoriaFromPublicacion(publicacionRelacionada).subscribe(categoria=>{
          publicacionRelacionada.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacionRelacionada).subscribe(autor=>{
            publicacionRelacionada.autor = autor;
          })
        })
      });
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
  getFechaPublicacion(){
    this.fechaFormateada = this.publicacion.fechaPublicacion.split("T")[0];
  }

  getLateral(){
    this.lateralService.getLateral().subscribe(lateral=>{
      this.lateral = lateral;
      this.showHtmlTwitter();
      this.showHtmlTwitter2();
      this.showHtmlTwitter3();
      this.showHtmlPodcast();
      this.showHtmlPodcastSM();
    })
  }
  
  showHtmlTwitter() {
    var twitterContainer = document.querySelector("#twitter");
    var tweetContainer = document.createElement('div');
    tweetContainer.classList.add('twitter-tweet');
    tweetContainer.innerHTML = this.lateral.htmlTwitter;
    twitterContainer?.appendChild(tweetContainer);
 
  }

  showHtmlTwitter2() {
    var twitterContainer = document.querySelector("#twitter2");
    var tweetContainer = document.createElement('div');
    tweetContainer.classList.add('twitter-tweet');
    tweetContainer.innerHTML = this.lateral.htmlTwitter2;
    twitterContainer?.appendChild(tweetContainer);
 
  }

  showHtmlTwitter3() {
    var twitterContainer = document.querySelector("#twitter3");
    var tweetContainer = document.createElement('div');
    tweetContainer.classList.add('twitter-tweet');
    tweetContainer.innerHTML = this.lateral.htmlTwitter3;
    twitterContainer?.appendChild(tweetContainer);
    twttr.widgets.load();
  }

  showHtmlPodcast() {
    var podcastContainer = document.querySelector("#podcast");
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
    console.log(html.innerHTML)
  }
  showHtmlPodcastSM() {
    var podcastContainer = document.querySelector("#podcastSM");
    var html = document.createElement("div");
    html.innerHTML = this.lateral.htmlPodcast;
    podcastContainer?.appendChild(html);
    console.log(html.innerHTML)
  }
  buscarPublicacionesPorPalabras() {
    console.log(this.palabrasClave)
    let palabrasClaveArray = this.palabrasClave.split(" ");
    const url = `/publicaciones-buscador/?palabrasClave=${encodeURIComponent(JSON.stringify(palabrasClaveArray))}`;
    this.router.navigateByUrl(url);
  }
}
