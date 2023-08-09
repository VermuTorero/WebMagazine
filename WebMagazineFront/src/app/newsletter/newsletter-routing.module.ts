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
import { EditorLateralComponent } from './editor-lateral/editor-lateral.component';
import { PublicacionesBuscadorComponent } from './publicaciones/publicaciones-buscador/publicaciones-buscador.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { SuscripcionFichaComponent } from './suscripcion/suscripcion-ficha/suscripcion-ficha.component';
import { VerificacionPagoComponent } from './suscripcion/verificacion-pago/verificacion-pago.component';
import { RenovarSuscripcionComponent } from './suscripcion/renovar-suscripcion/renovar-suscripcion.component';
import { ChatComponent } from './chat/chat.component';
import { PublicacionesBorradorComponent } from './publicaciones/publicaciones-borrador/publicaciones-borrador.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';


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
        path: `editor-lateral`,
        component: EditorLateralComponent,
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
        path: `acerca-de/editor/:paginaNombre`,
        component: EditorComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `publicaciones-buscador/:palabrasClave`,
        component: PublicacionesBuscadorComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `suscripcion`,
        component: SuscripcionComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `suscripcion-ficha`,
        component: SuscripcionFichaComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `verificacion-pago`,
        component: VerificacionPagoComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `renovar-suscripcion`,
        component: RenovarSuscripcionComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `chat`,
        component: ChatComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `borradores`,
        component: PublicacionesBorradorComponent,
      }
    ],
  },
  {
    path: ``,
    children: [
      {
        path: `estadisticas`,
        component: EstadisticasComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterRoutingModule { }
