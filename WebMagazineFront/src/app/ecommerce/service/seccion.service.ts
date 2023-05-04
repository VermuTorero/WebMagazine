import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Seccion } from '../models/seccion';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {

  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getSecciones(): Observable<Seccion[]>{
    return this.http.get<any>(this.endpoint + "/secciones").pipe(map(response=>response._embedded.secciones))
  }
  getIdSeccion(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }

  extraerUrlSeccion(response: any): string{
    return response._links.self.href
  }

  postSeccion(seccion: Seccion): Observable<Seccion>{
    return this.http.post<any>(this.endpoint + "/secciones", seccion);
  }

  patchSeccion(seccion: Seccion): Observable<Seccion>{
    return this.http.patch<any>(this.endpoint + "/secciones/"+ seccion.idSeccion, seccion);
  }
  deleteSeccion(seccion: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/secciones/"+ seccion.idSeccion);
  }
}
