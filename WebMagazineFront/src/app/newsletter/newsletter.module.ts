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

@NgModule({
  declarations: [
    PublicacionesComponent,
    PublicacionComponent,
    PublicacionCompletaComponent,
    PublicacionFichaComponent
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
