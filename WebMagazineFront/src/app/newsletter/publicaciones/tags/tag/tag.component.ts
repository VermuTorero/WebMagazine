import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from 'src/app/newsletter/models/Tag';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit{
  @Input() tag: Tag = new Tag();
  @Output() eliminarTagEvent = new EventEmitter<Tag>();
  @Output() modificarTagEvent = new EventEmitter<Tag>();

  ngOnInit(): void {
    
  }

  eliminarTag(){
    this.eliminarTagEvent.emit(this.tag);
  }
  modificarTag(){
    this.modificarTagEvent.emit(this.tag);
  }

}
