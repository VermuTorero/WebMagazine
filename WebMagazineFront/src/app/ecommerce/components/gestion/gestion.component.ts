import { Component, OnInit, PipeTransform } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { FormControl } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css'],
  providers: [DecimalPipe]
})
export class GestionComponent implements OnInit{

constructor(private productoService: ProductService, pipe: DecimalPipe){
  this.productos$ = this.filter.valueChanges.pipe(
    startWith(''),
    map((text) => this.search(text, pipe)),
  );
}

productos: Product[] = [];
productos$: Observable<Product[]>;
filter = new FormControl('', { nonNullable: true });

ngOnInit(): void {
  this.productos = this.productoService.getProducts();
}

search(text: string, pipe: PipeTransform): Product[] {
	return this.productos.filter((producto) => {
		const term = text.toLowerCase();
		return (
			producto.name.toLowerCase().includes(term) ||
			pipe.transform(producto.id).includes(term) ||
			pipe.transform(producto.price).includes(term)
		);
	});

}


}
