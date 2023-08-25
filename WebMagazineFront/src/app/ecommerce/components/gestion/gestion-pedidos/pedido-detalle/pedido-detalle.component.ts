import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, map, switchMap } from 'rxjs';
import { Pedido } from 'src/app/ecommerce/models/pedido';
import { Product } from 'src/app/ecommerce/models/product';
import { PedidosService } from 'src/app/ecommerce/service/pedidos.service';
import { ProductService } from 'src/app/ecommerce/service/product.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';

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
    private productoService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const pedidoId = this.route.snapshot.params['id'];
    this.getPedido(pedidoId);
  }
  getPedido(id: string){
    this.pedidoService.getPedido(id).subscribe(pedido=>{
      pedido.idPedido = this.pedidoService.getIdPedido(pedido);
      this.pedido = pedido;
      this.pedidoService.getProductosPedido(pedido).subscribe(productoPedidos=>{
        productoPedidos.forEach(productoPedido => {
          productoPedido.id = this.pedidoService.getIdPedido(productoPedido);
          this.productos.push(productoPedido.producto)
        });
        this.pedido.productos = productoPedidos;
      
      })
    })
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
    if(this.pedido.isCerrado){
      return "Cerrado"
    }else{
      return "Abierto"
    }

  }
  cerrarPedido(): void{

    if(this.pedido.fechaEnvio && this.pedido.fechaEntrega){
    const datos = {
      isCerrado: true
    };

      this.pedidoService.patchPedido( this.pedidoService.extraerUrlPedido(this.pedido) , datos).subscribe((res) => {
      window.location.reload();
      });
    }else{
      alert("Debe tener fecha de envío y de entrega para poder cerrar el pedido");
    }  
  }

  eliminarPedido(): void{

    this.pedidoService.deletePedido(this.pedidoService.extraerUrlPedido(this.pedido)).subscribe(() => this.router.navigate(['/ecommerce/gestion']));

  }

  }
  
  

