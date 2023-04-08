import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionesFormComponent } from './publicaciones/publicaciones-form/publicaciones-form.component';
import { PublicacionCompletaComponent } from './publicaciones/publicacion-completa/publicacion-completa.component';

const routes: Routes = [
  {path: '', component: PublicacionesComponent},
  {path: 'formulario', component: PublicacionesFormComponent},
  {
    path: ``,
    children: [
      {
        path: `publicaciones/:id`,
        component: PublicacionCompletaComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
