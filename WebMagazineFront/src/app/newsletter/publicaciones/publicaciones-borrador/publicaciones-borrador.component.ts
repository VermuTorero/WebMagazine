import { Component, OnInit } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';
import { CategoriasServiceService } from '../../service/categorias.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';

@Component({
  selector: 'app-publicaciones-borrador',
  templateUrl: './publicaciones-borrador.component.html',
  styleUrls: ['./publicaciones-borrador.component.css']
})
export class PublicacionesBorradorComponent implements OnInit{
  provincia: string = "";
  id: string = "";
  publicaciones: Publicacion[] = [];
  idUsuario: string = "";

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriasServiceService,
    private usuarioService: UsuariosService) { }

  ngOnInit(): void {
    this.usuarioService.getUsuarioFromToken().subscribe(usuario=>{
      this.idUsuario = this.usuarioService.getId(usuario);
      this.getBorradoresByUsuario();
    })
  }

  getBorradoresByUsuario(){
    this.publicacionesService.getBorradores(this.idUsuario).subscribe(borradores=>{
      this.publicaciones = borradores;
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
