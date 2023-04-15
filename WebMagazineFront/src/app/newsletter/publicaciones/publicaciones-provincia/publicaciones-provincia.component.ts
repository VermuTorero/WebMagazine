import { Component, OnInit } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.provincia = params['provincia']
      console.log("PROVINCIA RECIBIDA:", this.provincia)
    })
    this.getPublicacionesByLugar();
  }

  getPublicacionesByLugar(){
    this.publicacionesService.getPublicacionesByProvincia(this.provincia).subscribe(publicacionesProvincia=>{
      this.publicaciones = publicacionesProvincia;
      this.publicaciones.forEach(publicacion => {
        publicacion.id = this.publicacionesService.getId(publicacion);
      });
    })
  }

}
