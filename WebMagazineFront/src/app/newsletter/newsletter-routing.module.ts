import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionCompletaComponent } from './publicaciones/publicacion-completa/publicacion-completa.component';
import { PublicacionFichaComponent } from './publicaciones/publicacion-ficha/publicacion-ficha.component';
import { PublicacionesTagComponent } from './publicaciones/publicaciones-tag/publicaciones-tag.component';
import { PublicacionesProvinciaComponent } from './publicaciones/publicaciones-provincia/publicaciones-provincia.component';
import { TagsComponent } from './publicaciones/tags/tags.component';

const routes: Routes = [
  {path: '', component: PublicacionesComponent},
  {path: 'formulario', component: PublicacionFichaComponent},
  {
    path: ``,
    children: [
      {
        path: `publicaciones/:titulo`,
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
  },
  {
    path: ``,
    children: [
      {
        path: `publicaciones-tag/:tagNombre`,
        component: PublicacionesTagComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `publicaciones-provincia/:provincia`,
        component: PublicacionesProvinciaComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `tags`,
        component: TagsComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
