import { Component, OnInit } from '@angular/core';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { Publicacion } from '../../models/publicacion';
import { ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute) { }

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
      });
    })
  }

}
