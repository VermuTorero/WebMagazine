import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../models/publicacion';
import { PublicacionesServiceService } from '../service/publicaciones.service';

@Component({
  selector: 'app-editor-inicio',
  templateUrl: './editor-inicio.component.html',
  styleUrls: ['./editor-inicio.component.css']
})
export class EditorInicioComponent implements OnInit{
  publicaciones: Publicacion[] = [];
  publicacionesCarousel: Publicacion[] = [];
  constructor(private publicacionesService: PublicacionesServiceService){

  }
  ngOnInit(): void {
    this.getPublicaciones();
  }
  getPublicaciones(){
    this.publicacionesCarousel = [];
    this.publicacionesService.getPublicaciones().subscribe(publicaciones=>{
      this.publicaciones = publicaciones;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        if (publicacion.carousel) {
          this.publicacionesCarousel.push(publicacion);
        }
      });
    })
  }
  quitarDelCarousel(id: string){
    this.publicacionesService.getPublicacionById(id).subscribe(publicacion=>{
      publicacion.id = id;
      publicacion.carousel = false;
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
        autor.id = this.publicacionesService.getId(autor);
        publicacion.autor = autor;
        console.log("Autor: ", autor);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          categoria.id = this.publicacionesService.getId(categoria);
          publicacion.categoria = categoria;
          this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
            tags.forEach(tag => {
              tag.id = this.publicacionesService.getId(tag);
            });
            publicacion.tags = tags;
            this.publicacionesService.patchPublicacion(publicacion).subscribe(publicacion=>{
              this.getPublicaciones();
            })
          })
        })
      })
    })
  }
  agregarAlCarousel(id: string){
    this.publicacionesService.getPublicacionById(id).subscribe(publicacion=>{
      publicacion.id = id;
      publicacion.carousel = true;
      this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
        autor.id = this.publicacionesService.getId(autor);
        publicacion.autor = autor;
        console.log("Autor: ", autor);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          categoria.id = this.publicacionesService.getId(categoria);
          publicacion.categoria = categoria;
          this.publicacionesService.getTagsFromPublicacion(publicacion).subscribe(tags=>{
            tags.forEach(tag => {
              tag.id = this.publicacionesService.getId(tag);
            });
            publicacion.tags = tags;
            this.publicacionesService.patchPublicacion(publicacion).subscribe(publicacion=>{
              this.getPublicaciones();
            })
          })
        })
      })
    })
  }

}
