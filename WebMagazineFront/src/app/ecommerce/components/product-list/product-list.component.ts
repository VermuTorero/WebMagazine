import { SeccionService } from 'src/app/ecommerce/service/seccion.service';
import {  Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { Seccion } from '../../models/seccion';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  products: Product[] = [];
  ordenActual: string = 'precio';
  ordenAscendente: boolean = true;
  secciones: Seccion[] = []; // Lista de secciones de productos
  filteredProducts: Product[] = [];
  filtroSeccion: string = '';

  constructor(private productService: ProductService, private seccionesService: SeccionService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSecciones();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res;
      this.products.forEach(producto => {
        producto.id = this.productService.getIdProducto(producto);
        this.seccionesService.getSeccionById(producto.id).subscribe((res) =>{
          producto.seccion = res;
        });
      });
      this.applyFilter();
    });
  }

  loadSecciones(): void {
    this.seccionesService.getSecciones().subscribe((res) => {
      this.secciones = res;
    });
  }


  onChangeOrden(): void {
    this.applyFilter();
  }

  onChangeFiltro(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredProducts = this.products.filter((product) => {
      if (this.filtroSeccion) {
        return product.seccion.nombreSeccion === this.filtroSeccion;
      } else {
        return true; // Si no hay filtro de sección, muestra todos los productos
      }
    });
    this.sortProducts();
  }

  sortProducts(): void {
    if (this.ordenActual === 'precio') {
      this.sortByPrice();
    } else if (this.ordenActual === 'nombreProducto') {
      this.sortByName();
    }
  }

  sortByPrice(): void {
    this.filteredProducts.sort((a, b) => {
      if (a.precio < b.precio) {
        return this.ordenAscendente ? -1 : 1;
      } else if (a.precio > b.precio) {
        return this.ordenAscendente ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  sortByName(): void {
    this.filteredProducts.sort((a, b) => {
      if (a.nombreProducto < b.nombreProducto) {
        return this.ordenAscendente ? -1 : 1;
      } else if (a.nombreProducto > b.nombreProducto) {
        return this.ordenAscendente ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  cambiarOrden(): void {
    this.ordenAscendente = !this.ordenAscendente;
    this.sortProducts();
  }
}
