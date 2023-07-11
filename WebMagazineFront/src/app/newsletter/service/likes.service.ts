import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Like } from '../models/like';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getLikes(idPublicacion: string): Observable<Like[]>{
    return this.http.get<any>(this.endpoint + "/likes/search/likesFromPublicacion/" + idPublicacion).pipe(map(response=>response._embedded.likes));
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postLike(idPublicacion: string, like: Like): Observable<Like>{
    return this.http.post<any>(this.endpoint + "/likes/search/postLike/" + idPublicacion, like);
  }

  patchLike(like: Like): Observable<Like>{
    return this.http.patch<any>(this.endpoint + "/likes/"+ like.id, like);
  }

  deleteLike(idPublicacion: string,  like: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/likes/search/deleteLikeInPublicacion/"+ idPublicacion, like);
  }
}
