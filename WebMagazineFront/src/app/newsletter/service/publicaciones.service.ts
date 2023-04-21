import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Publicacion } from '../models/publicacion';
import { environment } from 'src/environments/enviroment';
import { Autor } from '../models/autor';
import { Tag } from '../models/Tag';
import { Categoria } from '../models/Categoria';
import { Lugar } from '../models/Lugar';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getPublicaciones(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones").pipe(map(response=>response._embedded.publicaciones))
  }

  getPublicacionesRecientes(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesRecientes").pipe(map(response=>response._embedded.publicaciones))
  }

  getPublicacionesDestacadas(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesDestacadas").pipe(map(response=>response._embedded.publicaciones))
  }

  postPublicacion(publicacion: Publicacion): Observable<Publicacion>{
    return this.http.post<any>(this.endpoint + "/publicaciones/search/postPublicacion", publicacion).pipe(map(response=>response.publicacion))
  }

  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  getAutorFromPublicacion(publicacion: any): Observable<Autor> {
    return this.http.get<any>(publicacion._links.autor.href);
  }
  getTagsFromPublicacion(publicacion: any): Observable<Tag[]> {
    return this.http.get<any>(publicacion._links.tags.href).pipe(map(response=>response._embedded.tags))
    ;
  }
  getCategoriaFromPublicacion(publicacion: any): Observable<Categoria> {
    return this.http.get<any>(publicacion._links.categoria.href);
  }
  getLugarFromPublicacion(publicacion: any): Observable<Lugar> {
    return this.http.get<any>(publicacion._links.lugar.href);
  } 
  getPublicacion(titulo: string): Observable<Publicacion>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionByTitulo/" + titulo)
  }
  getPublicacionById(id: string): Observable<Publicacion>{
    return this.http.get<any>(this.endpoint + "/publicaciones/" + id)
  }
  deletePublicacion(id: string): Observable<any>{
    return this.http.delete(this.endpoint + "/publicaciones/" + id);
  }
  patchPublicacion(publicacion: Publicacion): Observable<Publicacion>{
    return this.http.patch<any>(this.endpoint + "/publicaciones/search/patchPublicacion", publicacion).pipe(map(response=>response.publicacion));
  }
  getPublicacionesCerca(lugarNombre: string, idPublicacion: string): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesCerca/" + lugarNombre + "/" + idPublicacion).pipe(map(response=>response._embedded.publicaciones))
  }
  getPublicacionesRelacionadas(id: string): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesRelacionadas/" + id).pipe(map(response=>response._embedded.publicaciones))
  }
  getPublicacionesByTag(tagNombre: string): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesByTag/" + tagNombre).pipe(map(response=>response._embedded.publicaciones))
  }
  getPublicacionesByLugar(lugarNombre: string): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesByLugar/" + lugarNombre).pipe(map(response=>response._embedded.publicaciones))
  }
  getPublicacionesByCategoria(categoriaNombre: string): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesCategoria/" + categoriaNombre).pipe(map(response=>response._embedded.publicaciones))
  }
}
