import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit{

  constructor(private productoService: ProductService){}
productos: Product[] = [];
filter = new FormControl('', { nonNullable: true });

ngOnInit(): void {
  this.productos = this.productoService.getProducts();
}

}
