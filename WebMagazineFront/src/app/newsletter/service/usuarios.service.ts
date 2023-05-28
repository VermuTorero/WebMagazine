import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosServiceService {
  endpoint: string = environment.urlBack;

  constructor(private http: HttpClient) { }

  getAutores(): Observable<Usuario[]>{
    return this.http.get<any>(this.endpoint + "/usuarios/search/autores").pipe(map(response=>response._embedded.usuarios))
  }
  getAutor(id: string): Observable<Usuario>{
    return this.http.get<any>(this.endpoint + "/usuarios/search/autores/" + id)
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos =  url.split("/");
    return trozos[trozos.length - 1];
  }


}
