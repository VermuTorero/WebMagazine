import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Lugar } from 'src/app/newsletter/models/Lugar';
import { Tag } from 'src/app/newsletter/models/Tag';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrls: ['./lugar.component.css']
})
export class LugarComponent implements OnInit{
  @Input() lugar: Lugar = new Lugar();
  @Output() eliminarLugarEvent = new EventEmitter<Lugar>();
  @Output() modificarLugarEvent = new EventEmitter<Lugar>();

  ngOnInit(): void {
    
  }

  eliminarLugar(){
    this.eliminarLugarEvent.emit(this.lugar );
  }
  modificarLugar(){
    this.modificarLugarEvent.emit(this.lugar);
  }

}
