import { DecimalPipe } from '@angular/common';
import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/ecommerce/models/pedido';
import { PedidosService } from 'src/app/ecommerce/service/pedidos.service';
import { UsuariosService } from 'src/app/security/service/usuarios.service';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css'],
  providers: [DecimalPipe],
})
export class GestionPedidosComponent {
  pedidos: Pedido[] = [];
  abiertos: boolean;

  constructor(
    private pedidoService: PedidosService,
    private usuarioService: UsuariosService,
    private router: Router
  ) {
    this.abiertos = localStorage.getItem('abiertos') === 'true';
  }

  ngOnInit(): void {
    if(this.abiertos){
    this.pedidoService.getPedidosAbiertos().subscribe((res) => {
      this.pedidos = res;
      this.pedidos.forEach((pedido) => {
        pedido.idPedido = this.pedidoService.getIdPedido(pedido);
        this.usuarioService.getUsuario(this.pedidoService.extraerUsuarioPedido(pedido)).subscribe((resApi) => {
          pedido.usuario = resApi;
        });
      });
    });
    }else{
      this.pedidoService.getPedidosCerrados().subscribe((res) => {
        this.pedidos = res;
        this.pedidos.forEach((pedido) => {
          pedido.idPedido = this.pedidoService.getIdPedido(pedido);
          this.usuarioService.getUsuario(this.pedidoService.extraerUsuarioPedido(pedido)).subscribe((resApi) => {
            pedido.usuario = resApi;
          });
        });
      });
    }
  }

  cambiarVistaPedidos(){
    localStorage.setItem('abiertos', String(!this.abiertos));
    window.location.reload();
  }

  volverAGestionTienda(){
    this.router.navigate(['/ecommerce/gestion']);
  }

}
