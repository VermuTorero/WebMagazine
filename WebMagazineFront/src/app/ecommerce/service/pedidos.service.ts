import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pedido } from '../models/pedido';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PedidoProducto } from '../models/pedido-producto';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  endpoint: string = environment.urlAPI;
  constructor(private http: HttpClient) { }

  postPedido(pedido: Pedido): Observable <Pedido>{
    return this.http.post<any>(this.endpoint + "/pedidos", pedido);
  }

  postPedidoProducto(pedidoProducto: PedidoProducto): Observable <PedidoProducto>{
    return this.http.post<any>(this.endpoint + "/pedidoProductos", pedidoProducto);
  }

  extraerUrlPedidoProducto(pedidoProducto: any): string {
    return pedidoProducto._links.self.href
  }
}
