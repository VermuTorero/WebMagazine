import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/Tag';
import { TagsServiceService } from '../../service/tags.service';
import { Lugar } from '../../models/Lugar';
import { LugaresServiceService } from '../../service/lugares.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit{
  tags: Tag[] = [];
  tagNueva: Tag = new Tag();
  lugares: Lugar[] = [];
  lugarNuevo: Lugar = new Lugar();

  constructor(private tagsService: TagsServiceService,
    private lugaresService: LugaresServiceService){

  }
  ngOnInit(): void {
    this.getTags()
    this.getLugares();
  }
  getTags(){
    this.tagsService.getTags().subscribe(tags=>{
      this.tags = tags;
      this.tags.forEach(tag => {
        tag.id = this.tagsService.getId(tag);
      });
    })
  }
  modificarTag(tag: any){
    this.tagsService.patchTag(tag).subscribe(response=>{
      this.getTags();
    })
  }
  eliminarTag(tag:any){
    this.tagsService.deleteTag(tag).subscribe(response=>{
      this.getTags();
    })
  }
  nuevaTag(){
    this.tagsService.postTag(this.tagNueva).subscribe(response=>{
      this.getTags();
      this.tagNueva.tagNombre = "";
    })
  }

  getLugares(){
    this.lugaresService.getLugares().subscribe(lugares=>{
      this.lugares = lugares;
      this.lugares.forEach(lugar => {
        lugar.id = this.lugaresService.getId(lugar);
      });
    })
  }
  modificarLugar(lugar: any){
    this.lugaresService.patchLugar(lugar).subscribe(response=>{
      this.getLugares();
    })
  }
  eliminarLugar(lugar:any){
    this.lugaresService.deleteLugar(lugar).subscribe(response=>{
      this.getLugares();
    })
  }
  nuevoLugar(){
    this.lugaresService.postLugar(this.lugarNuevo).subscribe(response=>{
      this.getLugares();
      this.lugarNuevo.lugarNombre = "";
    })
  }

}
