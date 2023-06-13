import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoSuscripcion } from '../models/TipoSuscripcion';
import { CaracteristicaSuscripcion } from '../models/CaracteristicaSuscripcion';

@Injectable({
  providedIn: 'root'
})
export class TipoSuscripcionService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getTiposSuscripcion(): Observable<TipoSuscripcion[]>{
    return this.http.get<any>(this.endpoint + "/tipoSuscripcions").pipe(map(response=>response._embedded.tipoSuscripcions))
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postTipoSuscripcion(tipoSuscripcion: TipoSuscripcion): Observable<TipoSuscripcion>{
    return this.http.post<any>(this.endpoint + "/tipoSuscripcions", tipoSuscripcion);
  }

  patchTipoSuscripcion(tipoSuscripcion: TipoSuscripcion): Observable<TipoSuscripcion>{
    return this.http.patch<any>(this.endpoint + "/tipoSuscripcions/"+ tipoSuscripcion.id, tipoSuscripcion);
  }
  deleteTipoSuscripcion(tipoSuscripcion: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/tipoSuscripcions/"+ tipoSuscripcion.id);
  }
  getCaracteristicasFromSuscripcion(tipoSuscripcion: TipoSuscripcion): Observable<CaracteristicaSuscripcion[]> {
    return this.http.get<any>(this.endpoint + "/tipoSuscripcions/search/caractristicasByTipoSuscripcion/" + tipoSuscripcion.id).pipe(map(response=>response._embedded.caracteristicaSuscripcions))
  }
}
