import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
  fechaEnvio!: NgbDateStruct;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidosService,
    private usuariosService: UsuariosService,
    private productoService: ProductService
  ) { }

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

  fechaMinimaEnvio():NgbDateStruct {
    const date = new Date(this.pedido.fechaPedido)
    if(this.pedido.fechaPedido){
    return { year: date.getFullYear(), month: date.getMonth() , day: date.getDay()}; 
    }else{
      return { year: 1999, month: 1 , day: 1}; 
    }
  }

  marcarFechaEnvio(): void{
    if(this.fechaEnvio){
      this.pedidoService.patchPedido( this.pedidoService.extraerUrlPedido(this.pedido) , this.fechaEnvio).subscribe(() => this.ngOnInit());
    }else{
      alert("debe marcar una fecha de envío");
    }
    
  }
  
  
}
