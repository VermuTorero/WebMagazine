import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  /* { path: '**', redirectTo: '', pathMatch: 'full' }, */

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
