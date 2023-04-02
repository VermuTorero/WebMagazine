import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalEcommerceComponent } from './ecommerce/components/principal-ecommerce/principal-ecommerce.component';
import { ShellComponent } from './core/shell/shell.component';

const routes: Routes = [
  { path: ``,
    loadChildren: () =>
      import("src/app/newsletter/newsletter.module").then(
        (m) => m.NewsletterModule),
  },
  { path: `ecommerce`,
    loadChildren: () =>
      import("src/app/ecommerce/ecommerce.module").then(
        (m) => m.EcommerceModule),
  },
  { path: 'ecommerce', component: PrincipalEcommerceComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
