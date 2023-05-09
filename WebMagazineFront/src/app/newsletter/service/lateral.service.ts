import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Lateral } from '../models/lateral';

@Injectable({
  providedIn: 'root'
})
export class LateralServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }


  getLateral(): Observable<Lateral>{
    return this.http.get<any>(this.endpoint + "/laterales/1");
  }

  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postLateral(lateral: Lateral): Observable<Lateral>{
    return this.http.post<any>(this.endpoint + "/laterales", lateral);
  }
  patchLateral(lateral: Lateral): Observable<Lateral>{
    return this.http.patch<any>(this.endpoint + "/laterales/1", lateral);
  }

  deleteLateral(): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/laterales/1");
  }
}
