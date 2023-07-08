import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pedido } from '../models/pedido';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PedidoProducto } from '../models/pedido-producto';
import { Direccion } from '../models/direccion';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {


  getPedido(pedidoId: any): Observable<Pedido> {
    return this.http.get<any>(this.endpoint + "/pedidos/" + pedidoId);
  }

  endpoint: string = environment.urlAPI;
  constructor(private http: HttpClient) { }

  postPedido(pedido: Pedido): Observable <Pedido>{
    return this.http.post<any>(this.endpoint + "/pedidos/search/crearPedido", pedido);
  }

  postPedidoProducto(pedidoProducto: PedidoProducto): Observable <PedidoProducto>{
    return this.http.post<any>(this.endpoint + "/pedidoProductos", pedidoProducto);
  }

  deletePedido(urlPedido: string): Observable<any>{
    return this.http.delete<any>(urlPedido);
  }

  extraerUrlPedidoProducto(pedidoProducto: any): string {
    return pedidoProducto._links.self.href;
  }

  extraerUsuarioPedido(pedido: any): string {
    return pedido._links.usuario.href;
  }

  extraerDireccionPedido(pedido: any): string {
    return pedido._links.direccionEntrega.href;
  }

  extraerProductosPedido(pedido: any): string{
    return pedido._links.productos.href;
  }

  extraerProductoPedidoProducto(pedido: any): string{
    return pedido._links.producto.href;
  }

  extraerUrlPedido(pedido: any): string{
    return pedido._links.self.href;
  }



  getPedidosAbiertos(): Observable<Pedido[]> {   
    return this.http.get<any>(this.endpoint + "/pedidos/search/pedidos-abiertos").pipe(map(response=>response._embedded.pedidos));
  }

  getPedidosCerrados(): Observable<Pedido[]> {   
    return this.http.get<any>(this.endpoint + "/pedidos/search/pedidos-cerrados").pipe(map(response=>response._embedded.pedidos));
  }

  getProductosPedido(url:string): Observable<PedidoProducto[]>{
    return this.http.get<any>(url).pipe(map(response=>response._embedded.pedidosProductos));
  }

  getIdPedido(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }

  getIdDireccion(p: any): string {
    let url = p._links.self.href;
    let trozos = url.split("/");
    return trozos[trozos.length - 1];
  }

  getDireccionEntrega(url: string): Observable<Direccion>{
    return this.http.get<any>(url);
  }

  patchPedido(url: string, datos:any): Observable<any>{
    return this.http.patch(url, datos);
  }

}
