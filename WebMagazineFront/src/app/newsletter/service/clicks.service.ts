import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/Tag';
import { Categoria } from '../models/Categoria';
import { Click } from '../models/Click';

@Injectable({
  providedIn: 'root'
})
export class ClicksService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getClicks(): Observable<Click[]>{
    return this.http.get<any>(this.endpoint + "/clicks/search/clicks").pipe(map(response=>response._embedded.clicks))
  }
  getClicksByUser(id: string): Observable<Click[]>{
    return this.http.get<any>(this.endpoint + "/clicks/search/clicksByUser/" + id).pipe(map(response=>response._embedded.clicks))
  }

  getClicksByUserSince(id: string, fecha: string): Observable<Click[]>{
    return this.http.get<any>(this.endpoint + "/clicks/search/clicksByUser/" + id + "/" + fecha).pipe(map(response=>response._embedded.clicks))
  }

  getClicksSince(fecha: string): Observable<Click[]>{
    return this.http.get<any>(this.endpoint + "/clicks/search/clicksSince/" + fecha).pipe(map(response=>response._embedded.clicks))
  }

  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postClick(click: Click): Observable<Click>{
    return this.http.post<any>(this.endpoint + "/clicks/search/postClick", click);
  }

  getTagsFromClick(click: Click): Observable<Tag[]>{
    return this.http.get<any>(this.endpoint + "/clicks/search/tagsFromClick/" + click.id).pipe(map(response=>response?._embedded?.tags || []))
  }

}
