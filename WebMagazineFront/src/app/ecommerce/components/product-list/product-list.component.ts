import { ChangeDetectorRef, Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: Product[] = [];
  ordenActual: string = "precio"
  ordenAscendente: boolean = true;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }


  getProductosOrdenados(): Product[] {
    if(this.ordenActual == "precio"){
    return this.products.sort((a, b) => {
      if (a.precio < b.precio) {
        return this.ordenAscendente ? -1 : 1;
      } else if (a.precio > b.precio) {
        return this.ordenAscendente ? 1 : -1;
      } else {
        return 0;
        
      }
    });
    
  }else{
      return this.products.sort((a, b) => {
        if (a.precio < b.precio) {
          return this.ordenAscendente ? -1 : 1;
        } else if (a.precio > b.precio) {
          return this.ordenAscendente ? 1 : -1;
        } else {
          return 0;
        }
      });
  }
    }
    


  loadProducts(): void {
    this.productService.getProducts().subscribe((res) =>{
      console.log(res);
      this.products = res;
      this.getProductosOrdenados(); // Ordenar los productos al cargarlos inicialmente
    });
  }

  onChangeOrden(): void {
    this.getProductosOrdenados(); // Ordenar los productos cuando se cambia la opción del select
    this.products = [...this.products];
    console.log(this.products);
  }
}
