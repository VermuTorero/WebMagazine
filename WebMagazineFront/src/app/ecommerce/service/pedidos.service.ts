import { Injectable } from '@angular/core';
import { environment } from 'src/environments/enviroment';
import { Pedido } from '../models/pedido';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  endpoint: string = environment.urlAPI;
  constructor(private http: HttpClient) { }

  postPedido(pedido: Pedido): Observable <Pedido>{
    return this.http.post<any>(this.endpoint + "/pedidos", pedido);
  }
}
