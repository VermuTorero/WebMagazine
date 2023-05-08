import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionCompletaComponent } from './publicaciones/publicacion-completa/publicacion-completa.component';
import { PublicacionFichaComponent } from './publicaciones/publicacion-ficha/publicacion-ficha.component';
import { PublicacionesTagComponent } from './publicaciones/publicaciones-tag/publicaciones-tag.component';
import { PublicacionesCategoriaComponent } from './publicaciones/publicaciones-categoria/publicaciones-categoria.component';
import { TagsComponent } from './publicaciones/tags/tags.component';
import { PublicacionesProvinciaComponent } from './publicaciones/publicaciones-provincia/publicaciones-provincia.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EditorInicioComponent } from './editor-inicio/editor-inicio.component';
import { PaginaEditableComponent } from './pagina-editable/pagina-editable.component';
import { EditorComponent } from './pagina-editable/editor/editor.component';


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
        path: `publicaciones-categoria/:categoria`,
        component: PublicacionesCategoriaComponent,
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
  },
  {
    path: ``,
    children: [
      {
        path: `descubriendo-vermutorero`,
        component: LandingPageComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `editor-inicio`,
        component: EditorInicioComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `acerca-de/:paginaNombre`,
        component: PaginaEditableComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `sobre-nosotros/editor`,
        component: EditorComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
