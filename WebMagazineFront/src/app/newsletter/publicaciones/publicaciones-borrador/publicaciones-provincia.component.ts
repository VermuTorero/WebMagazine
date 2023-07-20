import { Component, OnInit } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';
import { CategoriasServiceService } from '../../service/categorias.service';

@Component({
  selector: 'app-publicaciones-provincia',
  templateUrl: './publicaciones-provincia.component.html',
  styleUrls: ['./publicaciones-provincia.component.css']
})
export class PublicacionesProvinciaComponent implements OnInit{
  provincia: string = "";
  id: string = "";
  publicaciones: Publicacion[] = [];

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriasServiceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.provincia = params['provincia'];
    })
    this.getPublicacionesByLugar();
  }

  getBorradoresByUsuario(){
    this.publicacionesService.getPublicacionesByLugar(this.provincia).subscribe(publicacionesProvincia=>{
      this.publicaciones = publicacionesProvincia;
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
