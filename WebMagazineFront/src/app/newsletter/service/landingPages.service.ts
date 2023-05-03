import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LandingPage } from '../models/LandingPage';

@Injectable({
  providedIn: 'root'
})
export class LandingPagesServiceService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getLandingPage(): Observable<LandingPage>{
    return this.http.get<any>(this.endpoint + "/landingpages/1");
  }
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postLandingPage(landingPage: LandingPage): Observable<LandingPage>{
    return this.http.post<any>(this.endpoint + "/landingpages", landingPage);
  }
  patchLandingPage(landingPage: LandingPage): Observable<LandingPage>{
    return this.http.patch<any>(this.endpoint + "/landingpages/"+ landingPage.id, landingPage);
  }
  deleteLandingPage(landingPage: any): Observable<any>{
    return this.http.delete<any>(this.endpoint + "/landingpages/"+ landingPage.id);
  }

}
