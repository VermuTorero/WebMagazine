import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './ecommerce/components/principal-ecommerce/principal-ecommerce.component';
import { MainComponent } from './core/shell/main/main.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'ecommerce', component: PrincipalEcommerceComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
