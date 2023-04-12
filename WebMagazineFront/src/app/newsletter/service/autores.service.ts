import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';
import { Tag } from '../models/Tag';
import { Autor } from '../models/autor';

@Injectable({
  providedIn: 'root'
})
export class AutoresServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getAutores(): Observable<Autor[]>{
    return this.http.get<any>(this.endpoint + "/autores").pipe(map(response=>response._embedded.autores))
  }
  getAutor(id: string): Observable<Autor>{
    return this.http.get<any>(this.endpoint + "/autores/" + id)
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }


}
