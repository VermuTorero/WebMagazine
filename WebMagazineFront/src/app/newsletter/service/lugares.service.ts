import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';
import { Tag } from '../models/Tag';
import { Lugar } from '../models/Lugar';

@Injectable({
  providedIn: 'root'
})
export class LugaresServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getLugares(): Observable<Lugar[]>{
    return this.http.get<any>(this.endpoint + "/lugares").pipe(map(response=>response._embedded.lugares))
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postLugar(lugar: Lugar): Observable<Lugar>{
    return this.http.post<any>(this.endpoint + "/lugares", lugar);
  }

  patchLugar(lugar: Lugar): Observable<Lugar>{
    return this.http.patch<any>(this.endpoint + "/lugares/"+ lugar.id, lugar);
  }
  deleteLugar(lugar: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/lugares/"+ lugar.id);
  }
}
