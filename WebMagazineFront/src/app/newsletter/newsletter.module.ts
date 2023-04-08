import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionComponent } from './publicaciones/publicacion/publicacion.component';
import { PublicacionesFormComponent } from './publicaciones/publicaciones-form/publicaciones-form.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { PublicacionCompletaComponent } from './publicaciones/publicacion-completa/publicacion-completa.component';

@NgModule({
  declarations: [
    PublicacionesComponent,
    PublicacionComponent,
    PublicacionesFormComponent,
    PublicacionCompletaComponent
  ],
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    FormsModule,
    QuillModule
  ]
})
export class NewsletterModule { }
