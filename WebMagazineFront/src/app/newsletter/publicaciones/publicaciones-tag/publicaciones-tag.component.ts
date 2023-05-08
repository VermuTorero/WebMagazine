import { Component, OnInit } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';
import { CategoriasServiceService } from '../../service/categorias.service';

@Component({
  selector: 'app-publicaciones-tag',
  templateUrl: './publicaciones-tag.component.html',
  styleUrls: ['./publicaciones-tag.component.css']
})

export class PublicacionesTagComponent implements OnInit{
  tagNombre: string = "";
  id: string = "";
  publicaciones: Publicacion[] = [];

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriasServiceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.tagNombre = params['tagNombre']
      console.log("TAG RECIBIDA:", this.tagNombre)
    })
    this.getPublicacionesByTag();
  }

  getPublicacionesByTag(){
    this.publicacionesService.getPublicacionesByTag(this.tagNombre).subscribe(publicacionesTag=>{
      this.publicaciones = publicacionesTag;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
        this.publicacionesService.getCategoriaFromPublicacion(publicacion).subscribe(categoria=>{
          publicacion.categoria = categoria;
          publicacion.categoria.id = this.categoriaService.getId(categoria);
        })
        this.publicacionesService.getAutorFromPublicacion(publicacion).subscribe(autor=>{
          publicacion.autor = autor;
        })
      });
    })
  }

}
