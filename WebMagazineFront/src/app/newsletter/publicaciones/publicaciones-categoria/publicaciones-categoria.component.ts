import { Component, OnInit } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../../models/Categoria';
import { CategoriasServiceService } from '../../service/categorias.service';

@Component({
  selector: 'app-publicaciones-categoria',
  templateUrl: './publicaciones-categoria.component.html',
  styleUrls: ['./publicaciones-categoria.component.css']
})
export class PublicacionesCategoriaComponent implements OnInit{
  categoria: Categoria = new Categoria();
  id: string = "";
  publicaciones: Publicacion[] = [];
  edicion: boolean = false;

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private categoriaService: CategoriasServiceService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.categoria.categoriaNombre = params['categoria']
      this.getCategoria();
      console.log("PROVINCIA RECIBIDA:", this.categoria)
    })
    this.getPublicacionesByCategoria();
  }
  getCategoria(){
    this.categoria.categoriaNombre = this.categoria.categoriaNombre.replaceAll("-", " ");
    this.categoriaService.getCategoriaByCategoriaNombre(this.categoria.categoriaNombre).subscribe(categoria=>{
      this.categoria = categoria;
      this.categoria.id = this.categoriaService.getId(this.categoria);
    })
  }

  getPublicacionesByCategoria(){
    this.publicacionesService.getPublicacionesByCategoria(this.categoria.categoriaNombre).subscribe(publicacionesCategoria=>{
      this.publicaciones = publicacionesCategoria;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
      });
    })
  }
  abrirEdicion(){
    this.edicion = true;
  }
  cerrarEdicion(){
    this.categoriaService.patchCategoria(this.categoria).subscribe(categoria=>{
      this.categoria = categoria;
      this.categoria.id = this.categoriaService.getId(this.categoria);
    })
    this.edicion = false;
    this.getCategoria();
  }
}
