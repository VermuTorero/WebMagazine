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
  pagina: number = 0;
  rol: string | null= "";

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriasServiceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.provincia = params['provincia'];
    })
    this.rol = sessionStorage.getItem('rol');
    this.getPublicacionesByLugar();
    
  }

  getPublicacionesByLugar(){
    this.publicacionesService.getPublicacionesByLugarPagina(this.provincia, this.pagina).subscribe(publicacionesProvincia=>{
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
  /* Navegar entre páginas */
  getPaginaSiguiente(){
    this.pagina++;
    /* Para usuarios con suscripcion */
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      this.publicacionesService.getPublicacionesByLugarPagina(this.provincia, this.pagina).subscribe(publicaciones=>{
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
      }, err=>{
        this.pagina--;
      })
    }else{
       /* Para usuarios sin suscripcion */
      this.publicacionesService.getPublicacionesByLugarFreePagina(this.provincia, this.pagina).subscribe(publicaciones=>{
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
      }, err=>{
        this.pagina--;
      })
    }
  }

  getPaginaAnterior(){
    /* Para usuarios con suscripcion */
    if (this.rol == "ROLE_ADMIN" || this.rol == "ROLE_WRITER" || this.rol == "ROLE_USER_SUSCRIBED" || this.rol == "ROLE_USER_MEMBER") {
      if (this.pagina>0) {
        this.pagina--;
        this.publicacionesService.getPublicacionesByLugarPagina(this.provincia, this.pagina).subscribe(publicaciones=>{
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
    }else{
      /* Para usuarios sin suscripcion */
      if (this.pagina>0) {
        this.pagina--;
        this.publicacionesService.getPublicacionesByLugarFreePagina(this.provincia, this.pagina).subscribe(publicaciones=>{
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
    } 
  }

}
