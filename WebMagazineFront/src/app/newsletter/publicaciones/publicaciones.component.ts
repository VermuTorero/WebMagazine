import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../models/publicacion';
import { PublicacionesServiceService } from '../service/publicaciones.service';
import { ImagenInicio } from '../models/imagenInicio';
import { ImagenesService } from '../service/imagenes.service';
import { Router } from '@angular/router';
import { LateralServiceService } from '../service/lateral.service';
import { Lateral } from '../models/lateral';
declare const twttr: any;

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  publicacionesDestacadas: Publicacion[] = [];
  publicacionesCarousel: Publicacion[]= [];
  urlImagenLateralDerecha: string = ""; 
  imagenInicioDerecha : ImagenInicio = new ImagenInicio();
  imagenInicioIzquierda: ImagenInicio = new ImagenInicio();
  imagenInicioCentral: ImagenInicio = new ImagenInicio();
  tituloUrl: string ="";
  lateral: Lateral = new Lateral();
  palabrasClave: string = "";
  rol: string | null = "";

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private imagenesService: ImagenesService,
    private router: Router,
    private lateralService: LateralServiceService) { }

  ngOnInit() {
    this.rol = sessionStorage.getItem('rol');
    this.getImagenesInicio(); 
    this.getLateral();
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITTER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      this.getPublicacionesRecientes();
    }else{
      this.getPublicacionesRecientesFree();
    }
    this.getPublicacionesDestacadas();
    this.getPublicacionesCarousel();
  }
/* Publicaciones recientes - 12 ultimas */
  getPublicacionesRecientes(){
    this.publicaciones = [];
    this.publicacionesService.getPublicacionesRecientes().subscribe(publicaciones => {
      this.publicaciones = publicaciones;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          publicacion.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
            publicacion.autor = autor;
          })
        })
      });
    })
  }
  /* Publicaciones recientes - 12 ultimas */
  getPublicacionesRecientesFree(){
    this.publicaciones = [];
    this.publicacionesService.getPublicacionesRecientesFree().subscribe(publicaciones => {
      this.publicaciones = publicaciones;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          publicacion.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
            publicacion.autor = autor;
          })
        })
      });
    })
  }
/* Publicaciones marcadas como destacadas */
  getPublicacionesDestacadas(){
    this.publicacionesDestacadas = [];
    this.publicacionesService.getPublicacionesDestacadas().subscribe(publicaciones => {
      this.publicacionesDestacadas = publicaciones;
      this.publicacionesDestacadas.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          publicacion.categoria = categoria;
          this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
            publicacion.autor = autor;
          })
        })
      });
    })
  }
/* Publicaciones agregadas al Carrusel */
  getPublicacionesCarousel(){
    this.publicacionesService.getPublicacionesCarousel().subscribe(publicacionesCarousel=>{
      this.publicacionesCarousel = publicacionesCarousel;
      this.publicacionesCarousel.forEach(publicacionCarousel => {
        publicacionCarousel.id = this.publicacionesService.getId(publicacionCarousel);
        publicacionCarousel.subtitulo = publicacionCarousel.subtitulo.substring(0,160) + "...";
       
      });
    })
  }
/* Imagenes de inicio promo izda, central y dcha */
  getImagenesInicio() {
    this.imagenesService.getImagenesInicio().subscribe(imagenesInicio => {
      imagenesInicio.forEach(imagenInicio => {
        if (imagenInicio.posicion == "derecha") {
          this.imagenInicioDerecha = imagenInicio;
        }
        if(imagenInicio.posicion == "izquierda"){
          this.imagenInicioIzquierda = imagenInicio;
        }
        if(imagenInicio.posicion == "centro"){
          this.imagenInicioCentral = imagenInicio;
        }
      });
    })
  }
/* routing a una publicacion a partir de su titulo */
  getPublicacionUrl(titulo: string){
    let url = "/publicaciones/" + titulo.replaceAll(" ", "-")
    this.router.navigate([url]);
  }

  getLateral(){
    this.lateralService.getLateral().subscribe(lateral=>{
      this.lateral = lateral;
      this.showHtmlPodcast();
      this.showHtmlPodcastSM();
      this.showHtmlTwitter();
      this.showHtmlTwitter2();
      this.showHtmlTwitter3();
  
    })
  }
  
  showHtmlTwitter() {
    var twitterContainer = document.querySelector("#twitter");
    var tweetContainer = document.createElement('div');
    tweetContainer.classList.add('twitter-tweet');
    tweetContainer.innerHTML = this.lateral.htmlTwitter;
    twitterContainer?.appendChild(tweetContainer);
    twttr.widgets.load();
  }

  showHtmlTwitter2() {
    var twitterContainer = document.querySelector("#twitter2");
    var tweetContainer = document.createElement('div');
    tweetContainer.classList.add('twitter-tweet');
    tweetContainer.innerHTML = this.lateral.htmlTwitter2;
    twitterContainer?.appendChild(tweetContainer);
    twttr.widgets.load();
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
