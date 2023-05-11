import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import { Pedido } from 'src/app/ecommerce/models/pedido';
import { Product } from 'src/app/ecommerce/models/product';
import { PedidosService } from 'src/app/ecommerce/service/pedidos.service';
import { ProductService } from 'src/app/ecommerce/service/product.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetalleComponent implements OnInit {

  pedido!: Pedido;
  productos: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidosService,
    private usuariosService: UsuariosService,
    private productoService: ProductService
  ) { }

  /* ngOnInit(): void {
    const pedidoId = this.route.snapshot.params['id'];
     this.pedidoService.getPedido(pedidoId).subscribe((pedidoRes) =>{
      this.pedido = pedidoRes;
      console.log(this.pedido);
      const usuarioInfo = this.usuariosService.getUsuario(this.pedidoService.extraerUsuarioPedido(this.pedido));
      const direccionEntrega = this.pedidoService.getDireccionEntrega(this.pedidoService.extraerDireccionPedido(this.pedido));
      this.pedidoService.getProductosPedido(this.pedidoService.extraerProductosPedido(this.pedido)).subscribe((arrayPedidoProductos) => {
        console.log(this.pedido, "dentro de get pedidos productos");
        console.log(arrayPedidoProductos, "res de dentro de get pedidos productos");
        this.pedido.productos = arrayPedidoProductos;
        this.pedido.productos.forEach(productoPedido => {
         this.productoService.getProductoPorUrl(this.pedidoService.extraerProductoPedidoProducto(productoPedido)).subscribe((res) =>{
          this.productos.push(res);
         });
        });
      });
      

      forkJoin([usuarioInfo, direccionEntrega]).subscribe(
        ([usuario, direccion]) => {
          this.pedido.usuario = usuario;
          this.pedido.direccionEntrega = direccion;
          console.log(this.pedido);
          console.log(this.productos);
        }
      )

    });
  }*/
  ngOnInit(): void {
    const pedidoId = this.route.snapshot.params['id'];
  
    this.pedidoService.getPedido(pedidoId).pipe(
      switchMap((pedidoRes) => {
        this.pedido = pedidoRes;
        console.log(this.pedido);
  
        const usuarioInfo = this.usuariosService.getUsuario(this.pedidoService.extraerUsuarioPedido(this.pedido));
        const direccionEntrega = this.pedidoService.getDireccionEntrega(this.pedidoService.extraerDireccionPedido(this.pedido));
        const productosPedido = this.pedidoService.getProductosPedido(this.pedidoService.extraerProductosPedido(this.pedido));
  
        return forkJoin([usuarioInfo, direccionEntrega, productosPedido]);
      })
    ).subscribe(([usuario, direccion, arrayPedidoProductos]) => {
      console.log(this.pedido, "dentro de get pedidos productos");
      console.log(arrayPedidoProductos, "res de dentro de get pedidos productos");
  
      this.pedido.usuario = usuario;
      this.pedido.direccionEntrega = direccion;
      this.pedido.productos = arrayPedidoProductos;
  
      const productoObservables = arrayPedidoProductos.map(productoPedido =>
        this.productoService.getProductoPorUrl(this.pedidoService.extraerProductoPedidoProducto(productoPedido))
      );
  
      forkJoin(productoObservables).subscribe((productos) => {
        this.productos = productos;
        console.log(this.pedido);
        console.log(this.productos);
      });
    });
  }
  
  
}
