import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionComponent } from './publicaciones/publicacion/publicacion.component';

@NgModule({
  declarations: [
    PublicacionesComponent,
    PublicacionComponent
  ],
  imports: [
    CommonModule,
    NewsletterRoutingModule
  ]
})
export class NewsletterModule { }
