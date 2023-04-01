import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //hardcoded para abreviar, pero estos datos de los productos deben venir del backend
  products: Product[] = [
    new Product(
      1,
      'Macbook Pro',
      'descripcion',
      19,
      'https://m.media-amazon.com/images/I/710-zIN6mML._AC_SL1500_.jpg'
    ),
    new Product(
      2,
      'Samsung Galaxy Book Go',
      'descripcion',
      35,
      'https://m.media-amazon.com/images/I/71WqmMpbo3L._AC_SL1500_.jpg'
    ),
    new Product(
      3,
      'Asus F415EA',
      'descripcion',
      46,
      'https://m.media-amazon.com/images/I/71SbYCE7O+L._AC_SL1500_.jpg'
    ),
    new Product(
      4,
      'Acer Aspire',
      'descripcion',
      59,
      'https://m.media-amazon.com/images/I/71qTAboBTsL._AC_SL1500_.jpg'
    ),
    new Product(
      5,
      'Surface Laptop 4',
      'descripcion',
      14,
      'https://m.media-amazon.com/images/I/71Sdk9Eru6S._AC_SL1500_.jpg'
    ),
    new Product(
      6,
      'Lenovo IdeaPad 3',
      'descripcion',
      7,
      'https://m.media-amazon.com/images/I/71-lKa3SBkL._AC_SL1500_.jpg'
    ),
  ];
  constructor() {}

  getProducts(): Product[] {
    return this.products;
  }
}
