import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../models/mensaje';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getMensajes(): Observable<Mensaje[]>{
    return this.http.get<any>(this.endpoint + "/mensajes/search/mensajes").pipe(map(response=>response._embedded.categorias))
  }

  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postMensaje(mensaje: Mensaje): Observable<Mensaje>{
    return this.http.post<any>(this.endpoint + "/mensajes/search/postMensaje", mensaje);
  }

  deleteMensaje(mensaje: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/mensajes/search/deleteMensaje"+ mensaje);
  }
}
