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
  fechaEntrega!: NgbDateStruct;

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
        console.log(this.pedido.cerrado);

  
        const usuarioInfo = this.usuariosService.getUsuario(this.pedidoService.extraerUsuarioPedido(this.pedido));
        const direccionEntrega = this.pedidoService.getDireccionEntrega(this.pedidoService.extraerDireccionPedido(this.pedido));
        const productosPedido = this.pedidoService.getProductosPedido(this.pedidoService.extraerProductosPedido(this.pedido));
  
        return forkJoin([usuarioInfo, direccionEntrega, productosPedido]);
      })
    ).subscribe(([usuario, direccion, arrayPedidoProductos]) => {
     
      this.pedido.usuario = usuario;
      this.pedido.direccionEntrega = direccion;
      this.pedido.productos = arrayPedidoProductos;
  
      const productoObservables = arrayPedidoProductos.map(productoPedido =>
        this.productoService.getProductoPorUrl(this.pedidoService.extraerProductoPedidoProducto(productoPedido))
      );
  
      forkJoin(productoObservables).subscribe((productos) => {
        this.productos = productos;
      });
    });
  }

  fechaMinimaEnvio():NgbDateStruct {
    const date = new Date(this.pedido.fechaPedido)
    if(this.pedido.fechaPedido){
    return { year: date.getFullYear(), month: date.getMonth() + 1 , day: date.getDay()}; 
    }else{
      return { year: 1999, month: 1 , day: 1}; 
    }
  }

  fechaMinimaEntrega():NgbDateStruct {
    const date = new Date(this.pedido.fechaEnvio)
    if(this.pedido.fechaEnvio){
    return { year: date.getFullYear(), month: date.getMonth() + 1 , day: date.getDay()}; 
    }else{
      return { year: 1999, month: 1 , day: 1}; 
    }
  }
  marcarFechaEntrega(): void{
    
    if(this.fechaEntrega){
      let date = new Date(this.fechaEntrega.year, this.fechaEntrega.month -1, this.fechaEntrega.day);
    const datos = {
      fechaEntrega: date
    };
      this.pedidoService.patchPedido( this.pedidoService.extraerUrlPedido(this.pedido) , datos).subscribe((res) => {
        window.location.reload();
        console.log(res);
      });
    }else{
      alert("debe marcar una fecha de entrega");
    }
    
  }
  marcarFechaEnvio(): void{
    
    if(this.fechaEnvio){
      let date = new Date(this.fechaEnvio.year, this.fechaEnvio.month -1, this.fechaEnvio.day);
    const datos = {
      fechaEnvio: date
    };
      this.pedidoService.patchPedido( this.pedidoService.extraerUrlPedido(this.pedido) , datos).subscribe((res) => {
        window.location.reload();
      });
    }else{
      alert("debe marcar una fecha de envío");
    }  
  }

  volver(): void {
      window.history.back();
  }

  estadoDelPedido(): string {
    if(this.pedido.cerrado){
      return "Cerrado"
    }else{
      return "Abierto"
    }

  }
  cerrarPedido(): void{

    if(this.pedido.fechaEnvio && this.pedido.fechaEntrega){
    const datos = {
      cerrado: true
    };
      this.pedidoService.patchPedido( this.pedidoService.extraerUrlPedido(this.pedido) , datos).subscribe((res) => {
      //  window.location.reload();
      console.log(res);
      });
    }else{
      alert("Debe tener fecha de envío y de entrega para poder cerrar el pedido");
    }  
  }

  }
  
  

