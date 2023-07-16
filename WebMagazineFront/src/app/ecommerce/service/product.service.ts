import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  endpoint: string = environment.urlAPI;
  
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {   
    return this.http.get<any>(this.endpoint + "/productos/search/productos").pipe(map(response=>response._embedded.productos));
  }
  postProducto(producto: Product): Observable <Product>{
    return this.http.post<Product>(this.endpoint + "/productos/search/postProducto", producto);
  }

  eliminarProducto(id: number): Observable <any>{
    return this.http.delete(this.endpoint + "/productos/search/deleteProducto/" + id);
  }

  getProductoPorId(id: any): Observable<Product>{
    return this.http.get<Product>(this.endpoint + "/productos/search/productoById/" + id);
  }
  patchProducto(producto: Product): Observable<Product>{
    return this.http.patch<any>(this.endpoint + "/productos/search/patchProducto", producto);
  }

  getProductoPorUrl(url: string){
    return this.http.get<any>(url);
  }

  getIdProducto(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }

  extraerUrlSeccion(producto: any): string{
    return producto._links.seccion.href;
  }

}
