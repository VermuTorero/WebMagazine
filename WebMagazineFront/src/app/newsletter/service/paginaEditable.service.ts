import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Lugar } from '../models/Lugar';
import { PaginaEditable } from '../models/PaginaEditable';

@Injectable({
  providedIn: 'root'
})
export class PaginaEditableService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getPaginaEditable(nombrePagina : string): Observable<PaginaEditable>{
    return this.http.get<any>(this.endpoint + "/paginaEditables/search/paginaEditableByNombrePagina/" + nombrePagina );
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  
  postPaginaEditable(paginaEditable: PaginaEditable): Observable<PaginaEditable>{
    return this.http.post<any>(this.endpoint + "/paginaEditables", paginaEditable);
  }

  patchPaginaEditable(paginaEditable: PaginaEditable): Observable<PaginaEditable>{
    return this.http.patch<any>(this.endpoint + "/paginaEditables/search/patchPaginaEditable/" + paginaEditable.id, paginaEditable);
  }

  deletePaginaEditable(paginaEditable: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/paginaEditables/"+ paginaEditable.id);
  }
}
