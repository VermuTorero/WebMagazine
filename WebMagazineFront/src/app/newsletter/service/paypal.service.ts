import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/Tag';
import { Categoria } from '../models/Categoria';
import { PayPal } from '../models/PayPal';

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  endpoint: string = environment.urlAPI;

  constructor(private http: HttpClient) { }

  getPayPal(): Observable<PayPal>{
    return this.http.get<any>(this.endpoint + "/paypals/search/paypal");
  }
 
  getId(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }
  postPayPal(payPal: PayPal): Observable<PayPal>{
    return this.http.post<any>(this.endpoint + "/paypals/search/postPaypal", payPal);
  }

  patchPayPal(paypal: PayPal): Observable<PayPal>{
    return this.http.patch<any>(this.endpoint + "/paypals/search/patchPaypal"+ paypal.id, paypal);
  }

}
