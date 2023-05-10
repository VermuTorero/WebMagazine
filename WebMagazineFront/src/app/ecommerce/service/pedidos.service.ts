import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pedido } from '../models/pedido';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PedidoProducto } from '../models/pedido-producto';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  endpoint: string = environment.urlAPI;
  constructor(private http: HttpClient) { }

  postPedido(pedido: Pedido): Observable <Pedido>{
    return this.http.post<any>(this.endpoint + "/pedidos/search/crearPedido", pedido);
  }

  postPedidoProducto(pedidoProducto: PedidoProducto): Observable <PedidoProducto>{
    return this.http.post<any>(this.endpoint + "/pedidoProductos", pedidoProducto);
  }

  extraerUrlPedidoProducto(pedidoProducto: any): string {
    return pedidoProducto._links.self.href;
  }

  extraerUsuarioPedido(pedido: any): string {
    return pedido._links.usuario.href;
  }

  getPedidos(): Observable<Pedido[]> {   
    return this.http.get<any>(this.endpoint + "/pedidos").pipe(map(response=>response._embedded.pedidos));
  }

  getIdPedido(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }

}
