import { DecimalPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, switchMap, map, Observable, forkJoin, mergeMap } from 'rxjs';
import { UsuariosService } from 'src/app/core/service/usuarios.service';
import { Pedido } from 'src/app/ecommerce/models/pedido';
import { PedidoUsuario } from 'src/app/ecommerce/models/pedido-usuario';
import { PedidosService } from 'src/app/ecommerce/service/pedidos.service';


@Component({
  selector: 'app-gestion-pedidos',
  templateUrl: './gestion-pedidos.component.html',
  styleUrls: ['./gestion-pedidos.component.css'],
  providers: [DecimalPipe]
})
export class GestionPedidosComponent {


  constructor(private pedidoService: PedidosService,  private usuarioService: UsuariosService) {
  }
  
  pedidos: PedidoUsuario[] = [];

  ngOnInit(): void {
    
  }
  
  }
  

