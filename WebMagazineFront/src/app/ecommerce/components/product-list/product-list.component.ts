import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: Product[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((res) =>{
      console.log(res);
      this.products = res;
    });
  }
}
