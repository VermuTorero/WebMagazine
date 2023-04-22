import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';
import { SeccionesComponent } from './components/secciones/secciones.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { FormularioProductoComponent } from './components/gestion/formulario-producto/formulario-producto.component';

const routes: Routes = [
  { path: 'ecommerce', component: PrincipalEcommerceComponent },

  {
    path: 'secciones',
    component: SeccionesComponent,
  },
  {
    path: 'gestion',
    children: [
      {
        path: `crear-producto`,
        component: FormularioProductoComponent,
      },
      {
        path: ``,
        component: GestionComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {}
