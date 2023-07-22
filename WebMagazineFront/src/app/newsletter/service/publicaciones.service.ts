import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Publicacion } from '../models/publicacion';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/Tag';
import { Categoria } from '../models/Categoria';
import { Lugar } from '../models/Lugar';
import { Usuario } from 'src/app/security/models/usuario';
import { Like } from '../models/like';

const cabecera = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

@Injectable({
  providedIn: 'root'
})
export class PublicacionesServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getPublicacionesRecientes(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesRecientes").pipe(map(response=>response._embedded.publicaciones))
  }
  getPublicacionesRecientesFree(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesRecientesFree").pipe(map(response=>response._embedded.publicaciones))
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
  getAutorFromPublicacion(publicacion: any): Observable<Usuario> {
    return this.http.get<any>(this.endpoint + "/publicaciones/search/getAutorFromPublicacion/" + publicacion.id);
  }
  getTagsFromPublicacion(publicacion: any): Observable<Tag[]> {
    return this.http.get<any>(this.endpoint + "/publicaciones/search/getTagsFromPublicacion/" + publicacion.id).pipe(map(response=>response._embedded.tags))
    ;
  }
  getCategoriaFromPublicacion(publicacion: any): Observable<Categoria> {
    return this.http.get<any>(this.endpoint + "/publicaciones/search/getCategoriaFromPublicacion/" + publicacion.id);
  }
  getLugarFromPublicacion(publicacion: any): Observable<Lugar> {
    return this.http.get<any>(this.endpoint + "/publicaciones/search/getLugarFromPublicacion/" + publicacion.id);
  } 
  getPublicacion(url: string): Observable<Publicacion>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionByUrl/" + url)
  }
  getPublicacionFree(url: string): Observable<Publicacion>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionByUrlFree/" + url)
  }
  getPublicacionById(id: string): Observable<Publicacion>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionById/" + id)
  }
  deletePublicacion(id: string): Observable<any>{
    return this.http.delete(this.endpoint + "/publicaciones/search/deletePublicacion/" + id);
  }
  patchPublicacion(publicacion: Publicacion): Observable<Publicacion>{
    return this.http.patch<any>(this.endpoint + "/publicaciones/search/patchPublicacion", publicacion);
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
  getPublicacionesCarousel(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesCarousel").pipe(map(response=>response._embedded.publicaciones));
  }
  getPublicacionesNoCarousel(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesNoCarousel").pipe(map(response=>response._embedded.publicaciones));
  }
  getPublicacionesBuscador(palbrasClave: string[]): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint +  "/publicaciones/search/buscar-publicaciones?palabrasClave=" + palbrasClave[0] + "," + palbrasClave[1]
     + "," + palbrasClave[2] + "," + palbrasClave[3] + "," + palbrasClave[4] + "," + palbrasClave[5]).pipe(map(response=>response._embedded.publicaciones))
  }
  getLikesFromPublicacion(publicacion: any): Observable<Like[]> {
    return this.http.get<any>(this.endpoint + "/publicaciones/search/getLikesFromPublicacion/" + publicacion.id).pipe(map(response=>response._embedded.likes))
    ;
  }
  getBorradores(idUsuario: string):Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/borradores/" + idUsuario).pipe(map(response=>response._embedded.publicaciones))
  }
}
