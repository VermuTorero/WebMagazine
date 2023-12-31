import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/Tag';

@Injectable({
  providedIn: 'root'
})
export class TagsServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getTags(): Observable<Tag[]>{
    return this.http.get<any>(this.endpoint + "/tags").pipe(map(response=>response._embedded.tags))
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postTag(tag: Tag): Observable<Tag>{
    return this.http.post<any>(this.endpoint + "/tags", tag);
  }

  patchTag(tag: Tag): Observable<Tag>{
    return this.http.patch<any>(this.endpoint + "/tags/"+ tag.id, tag);
  }
  deleteTag(tag: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/tags/"+ tag.id);
  }
}
