import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';
import { SeccionesComponent } from './components/secciones/secciones.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { FormularioProductoComponent } from './components/gestion/formulario-producto/formulario-producto.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { GestionPedidosComponent } from './components/gestion/gestion-pedidos/gestion-pedidos.component';
import { PedidoDetalleComponent } from './components/gestion/gestion-pedidos/pedido-detalle/pedido-detalle.component';

const routes: Routes = [
  {
    path: 'ecommerce',
    children: [
      {
        path: ``,
        component: PrincipalEcommerceComponent,
      },
      {
        path: 'pedido',
        component: PedidoComponent,
      },
      {
        path: 'gestion',
        children: [
          {
            path: `crear-producto`,
            component: FormularioProductoComponent,
          },
          {
            path: `crear-producto/:id`,
            component: FormularioProductoComponent,
          },
          {
            path: ``,
            component: GestionComponent,
          },
          {
            path: 'secciones',
            component: SeccionesComponent,
          },
          {
            path: 'pedidos',
            children: [
              {
                path: ``,
                component: GestionPedidosComponent,
              },
              { path: 'pedido/:id', component: PedidoDetalleComponent },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {}
