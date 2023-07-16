import { Component,OnInit, PipeTransform } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { FormControl } from '@angular/forms';
import { Observable, map, of, startWith, switchMap } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css'],
  providers: [DecimalPipe]
})

export class GestionComponent implements OnInit{

constructor(private productoService: ProductService, pipe: DecimalPipe, private router: Router){
  this.filter = new FormControl('', { nonNullable: true });
  this.productos$ = this.filter.valueChanges.pipe(
    startWith(''),
    switchMap(() => this.productoService.getProducts()),
    map((productos) => this.search(this.filter.value, pipe, productos)),
  );
}

productos: Product[] = [];
productos$: Observable<Product[]>;
filter: FormControl;

ngOnInit(): void {
this.productoService.getProducts().subscribe((res) =>{
  this.productos = res;
});
 
}

search(text: string, pipe: PipeTransform, productos: Product[]): Product[] {
  if (!productos) return [];
  return productos.filter((producto) => {
    const term = text.toLowerCase();
    return (
      producto.nombreProducto.toLowerCase().includes(term) ||
      pipe.transform(producto.id).includes(term) ||
      pipe.transform(producto.precio).includes(term)
    );
  });
}

eliminarProducto(id: string){
  this.productoService.eliminarProducto(id).subscribe(() =>{
    console.log("eliminado");
    window.location.reload();
  } );
}

}



