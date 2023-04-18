import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';

const routes: Routes = [
  {path: 'ecommerce', component: PrincipalEcommerceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class EcommerceRoutingModule { }
