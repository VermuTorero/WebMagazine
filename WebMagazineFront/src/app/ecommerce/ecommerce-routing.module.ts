import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';
import { SeccionesComponent } from './components/secciones/secciones.component';
import { GestionComponent } from './components/gestion/gestion.component';

const routes: Routes = [
  { path: 'ecommerce', component: PrincipalEcommerceComponent },

  {
    path: 'secciones',
    component: SeccionesComponent,
  },
  {
    path: 'gestion',
    component: GestionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {}
