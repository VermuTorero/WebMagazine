import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Publicacion } from '../models/publicacion';
import { PublicacionesServiceService } from '../service/publicaciones.service';
import { ImagenInicio } from '../models/imagenInicio';
import { ImagenesService } from '../service/imagenes.service';
import { Router } from '@angular/router';

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

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private imagenesService: ImagenesService,
    private router: Router) { }

  ngOnInit() {
    this.getPublicaciones();
    this.getPublicacionesDestacadas();
    this.getPublicacionesCarousel();
    this.getImagenesInicio();
    
  }

  getPublicaciones(): Observable<Publicacion[]> {
    this.publicaciones = [];
    this.publicacionesService.getPublicacionesRecientes().subscribe(publicaciones => {
      this.publicaciones = publicaciones;
      
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
      });
    })
    return of();
  }

  getPublicacionesDestacadas(): Observable<Publicacion[]> {
    this.publicacionesDestacadas = [];
    this.publicacionesService.getPublicacionesDestacadas().subscribe(publicaciones => {
      this.publicacionesDestacadas = publicaciones;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
      });
    })
    return of();
  }
  getPublicacionesCarousel(){
    this.publicacionesService.getPublicacionesCarousel().subscribe(publicacionesCarousel=>{
      this.publicacionesCarousel = publicacionesCarousel;
      this.publicacionesCarousel.forEach(publicacionCarousel => {
        publicacionCarousel.id = this.publicacionesService.getId(publicacionCarousel);
        publicacionCarousel.subtitulo = publicacionCarousel.subtitulo.substring(0,60) + "..."
      });
    })
  }
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

  getPublicacionUrl(titulo: string){
    let url = "/publicaciones/" + titulo.replaceAll(" ", "-")
    this.router.navigate([url]);
  }
}
