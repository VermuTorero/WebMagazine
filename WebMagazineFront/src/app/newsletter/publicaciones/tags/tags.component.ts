import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/Tag';
import { TagsServiceService } from '../../service/tags.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit{
  tags: Tag[] = [];
  tagNueva: Tag = new Tag();

  constructor(private tagsService: TagsServiceService){

  }
  ngOnInit(): void {
    this.getTags()
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

}
