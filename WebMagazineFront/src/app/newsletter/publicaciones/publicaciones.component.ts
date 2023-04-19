import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Publicacion } from '../models/publicacion';
import { PublicacionesServiceService } from '../service/publicaciones.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {

  publicaciones: Publicacion[] = [];
  publicacionesDestacadas: Publicacion[] = [];

  constructor(
    private publicacionesService: PublicacionesServiceService) { }

  ngOnInit() {
    this.getPublicaciones();
    this.getPublicacionesDestacadas();
    
  }

  getPublicaciones(): Observable<Publicacion[]> {
    this.publicaciones = [];
    this.publicacionesService.getPublicacionesRecientes().subscribe(publicaciones => {
      this.publicaciones = publicaciones;
      
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
      });
      console.log("PUBLICACIONES CON ID", this.publicaciones);
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
      console.log("PUBLICACIONES DESTACADAS CON ID", this.publicaciones);
    })
    return of();
  }

}
