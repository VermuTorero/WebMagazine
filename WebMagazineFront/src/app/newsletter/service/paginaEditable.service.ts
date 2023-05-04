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

  getPaginaEditable(): Observable<PaginaEditable>{
    return this.http.get<any>(this.endpoint + "/paginaEditables/1");
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postPaginaEditable(paginaEditable: PaginaEditable): Observable<PaginaEditable>{
    return this.http.post<any>(this.endpoint + "/paginaEditables/1", paginaEditable);
  }

  patchPaginaEditable(paginaEditable: PaginaEditable): Observable<PaginaEditable>{
    return this.http.patch<any>(this.endpoint + "/paginaEditables/1", paginaEditable);
  }

  deletePaginaEditable(paginaEditable: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/paginaEditables/"+ paginaEditable.id);
  }
}
