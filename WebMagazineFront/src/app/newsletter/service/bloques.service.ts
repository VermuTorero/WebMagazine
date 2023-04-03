import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Publicacion } from '../models/publicacion';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BloquesService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getBloquesFromPublicacion(idPublicacion: string): Observable<Publicacion[]>{
    return this.http.get<any>(this.endpoint + "/bloques/search/bloquesPublicacion/" + idPublicacion).pipe(map(response=>response._embedded.bloques))
  }
}
