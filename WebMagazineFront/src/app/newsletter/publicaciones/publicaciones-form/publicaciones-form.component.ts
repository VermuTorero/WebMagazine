import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { PublicacionesServiceService } from '../../service/publicaciones.service';
import { TagsServiceService } from '../../service/tags.service';
import { Tag } from '../../models/Tag';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Autor } from '../../models/autor';
import { AutoresServiceService } from '../../service/autores.service';
import { environment } from 'src/enviroments/enviroment';
import Quill from 'quill';
var quill = new Quill('#editor', {
  theme: 'snow'
});

@Component({
  selector: 'app-publicaciones-form',
  templateUrl: './publicaciones-form.component.html',
  styleUrls: ['./publicaciones-form.component.css']
})
export class PublicacionesFormComponent implements OnInit {

  publicacion: Publicacion = new Publicacion();
  texto: string = "";
  urlImagen: string = "";
  urlVideo: string = "";
  htmlPodcast: string = "";
  htmlVideo: string = "";
  tags: Tag[] = [];
  autores: Autor[] = [];
  tagNueva: Tag = new Tag();
  endpointTags: string = environment.urlAPI + "/tags/";
  endpointAutores: string = environment.urlAPI + "/autores/";
  

  constructor(
    private publicacionesService: PublicacionesServiceService,
     private tagsService: TagsServiceService, private autoresService: AutoresServiceService,private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap)=>{
      this.getTags();
      this.getAutores();
      setInterval(()=>{
        console.log(this.texto)
      }, 5000)
    })
  }


  agregarPodcast() {
    this.texto = this.texto +  this.htmlPodcast ;
  }
  agregarVideo() {
    this.htmlVideo = this.htmlVideo.replaceAll('<iframe', '<iframe class="iframe"');
      
    this.texto = this.texto +  this.htmlVideo ;
    this.htmlVideo = "";
  }

  postPublicacion() {
    this.publicacion.htmlPublicacion = this.texto;
 
    this.publicacionesService.postPublicacion(this.publicacion).subscribe();
  }

  getTags(): void {
    this.tagsService.getTags().subscribe(tags=>{
      console.log(tags)
      this.tags = tags;
      this.tags.forEach(tag => {
       tag.id =  this.tagsService.getId(tag);
      });
      console.log("TAGS CON ID:", this.tags)
    });
  }
  getAutores(): void {
    this.autoresService.getAutores().subscribe(autores=>{
      console.log(autores)
      this.autores = autores;
      this.autores.forEach(autor => {
        autor.id =  this.autoresService.getId(autor);
       });
       console.log("AUTORES CON ID:", this.autores )
    });
  }

}
