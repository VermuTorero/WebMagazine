import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Publicacion } from '../models/publicacion';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getPublicaciones(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones").pipe(map(response=>response._embedded.publicaciones))
  }

  getPublicacionesDestacadas(): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/publicaciones/search/publicacionesDestacadas").pipe(map(response=>response._embedded.publicaciones))
  }
}
