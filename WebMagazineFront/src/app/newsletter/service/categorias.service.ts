import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/Tag';
import { Categoria } from '../models/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<Categoria[]>{
    return this.http.get<any>(this.endpoint + "/categorias").pipe(map(response=>response._embedded.categorias))
  }
  getCategoria(idCategoria: string): Observable<Categoria>{
    return this.http.get<any>(this.endpoint + "/categorias/" + idCategoria);
  }
  getCategoriaByCategoriaNombre(categoriaNombre: string): Observable<Categoria>{
    return this.http.get<any>(this.endpoint + "/categorias/search/categoriaByCategoriaNombre/" + categoriaNombre);
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postCategoria(categoria: Categoria): Observable<Categoria>{
    return this.http.post<any>(this.endpoint + "/categorias", categoria);
  }

  patchCategoria(categoria: Categoria): Observable<Categoria>{
    return this.http.patch<any>(this.endpoint + "/categorias/search/patchCategoria/"+ categoria.id, categoria);
  }
  deleteCategoria(categoria: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/categorias/"+ categoria.id);
  }
}
