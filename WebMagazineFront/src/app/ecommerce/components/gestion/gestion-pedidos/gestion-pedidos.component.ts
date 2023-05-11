import { DecimalPipe } from '@angular/common';
import { Component} from '@angular/core';
import { Router } from '@angular/router';

import { UsuariosService } from 'src/app/core/service/usuarios.service';
import { Pedido } from 'src/app/ecommerce/models/pedido';

import { PedidosService } from 'src/app/ecommerce/service/pedidos.service';

@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css'],
  providers: [DecimalPipe],
})
export class GestionPedidosComponent {
  pedidos: Pedido[] = [];

  constructor(
    private pedidoService: PedidosService,
    private usuarioService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe((res) => {
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
