import { Component } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { ActivatedRoute } from '@angular/router';
import { CategoriasServiceService } from '../../service/categorias.service';

@Component({
  selector: 'app-publicaciones-buscador',
  templateUrl: './publicaciones-buscador.component.html',
  styleUrls: ['./publicaciones-buscador.component.css']
})
export class PublicacionesBuscadorComponent {
  palabrasClave: string[] = [];
  id: string = "";
  publicaciones: Publicacion[] = [];
  pagina: number = 0;
  rol: string | null= "";

  constructor(
    private publicacionesService: PublicacionesServiceService,
    private activatedRoute: ActivatedRoute,
    private categoriaService: CategoriasServiceService) { }

  ngOnInit(): void {
    const palabrasClaveString = this.activatedRoute.snapshot.queryParamMap.get('palabrasClave');
    if (palabrasClaveString) {
      this.palabrasClave = JSON.parse(decodeURIComponent(palabrasClaveString));
    }
    this.getPublicacionesByPalabras();
  }

  getPublicacionesByPalabras(){
    this.publicacionesService.getPublicacionesBuscador(this.palabrasClave, this.pagina).subscribe(publicacionesBuscador=>{
      this.publicaciones = publicacionesBuscador;
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
    }, err=>{
      this.pagina--;
    })
  }
  /* Navegar entre páginas */
  getPaginaSiguiente(){
    this.pagina++;
      this.getPublicacionesByPalabras();
  }

  getPaginaAnterior(){
    /* Para usuarios con suscripcion */
      if (this.pagina>0) {
        this.pagina--;
        this.getPublicacionesByPalabras();
      }
    
  }
}
