import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionCompletaComponent } from './publicaciones/publicacion-completa/publicacion-completa.component';
import { PublicacionFichaComponent } from './publicaciones/publicacion-ficha/publicacion-ficha.component';

const routes: Routes = [
  {path: '', component: PublicacionesComponent},
  {path: 'formulario', component: PublicacionFichaComponent},
  {
    path: ``,
    children: [
      {
        path: `publicaciones/:id`,
        component: PublicacionCompletaComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `formulario/:id`,
        component: PublicacionFichaComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
