import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';
import { SeccionesComponent } from './components/secciones/secciones.component';

const routes: Routes = [
  { path: 'ecommerce', component: PrincipalEcommerceComponent },

  {
    path: 'secciones',
    component: SeccionesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {}
