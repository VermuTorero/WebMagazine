import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionComponent } from './publicaciones/publicacion/publicacion.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PublicacionCompletaComponent } from './publicaciones/publicacion-completa/publicacion-completa.component';
import { PublicacionFichaComponent } from './publicaciones/publicacion-ficha/publicacion-ficha.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { PublicacionesTagComponent } from './publicaciones/publicaciones-tag/publicaciones-tag.component';
import { TagsComponent } from './publicaciones/tags/tags.component';
import { TagComponent } from './publicaciones/tags/tag/tag.component';
import { LugarComponent } from './publicaciones/tags/lugar/lugar.component';
import { PublicacionesProvinciaComponent } from './publicaciones/publicaciones-provincia/publicaciones-provincia.component';
import { PublicacionesCategoriaComponent } from './publicaciones/publicaciones-categoria/publicaciones-categoria.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { EditorInicioComponent } from './editor-inicio/editor-inicio.component';
import { PaginaEditableComponent } from './pagina-editable/pagina-editable.component';
import { EditorComponent } from './pagina-editable/editor/editor.component';
import { EditorLateralComponent } from './editor-lateral/editor-lateral.component';
import { PublicacionesBuscadorComponent } from './publicaciones/publicaciones-buscador/publicaciones-buscador.component';




@NgModule({
  declarations: [
    PublicacionesComponent,
    PublicacionComponent,
    PublicacionCompletaComponent,
    PublicacionFichaComponent,
    PublicacionesTagComponent,
    PublicacionesProvinciaComponent,
    PublicacionesCategoriaComponent,
    TagsComponent,
    TagComponent,
    LugarComponent,
    LandingPageComponent,
    EditorInicioComponent,
    PaginaEditableComponent,
    EditorComponent,
    EditorLateralComponent,
    PublicacionesBuscadorComponent
  ],
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    FormsModule,
    QuillModule,
    AngularCropperjsModule
  ]
})
export class NewsletterModule { }
