import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {
  private tweetUrl = 'https://publish.twitter.com/oembed';

  constructor(private http: HttpClient) { }

  getTweet(tweetUrl: string): Observable<any> {
    return this.http.get(`${this.tweetUrl}?url=${tweetUrl}`);
  }
}

