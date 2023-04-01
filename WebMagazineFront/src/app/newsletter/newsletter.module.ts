import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { PublicacionesComponent } from './publicaciones/publicaciones.component';
import { PublicacionComponent } from './publicaciones/publicacion/publicacion.component';
import { PublicacionServiceComponent } from './service/publicacion-service/publicacion-service.component';


@NgModule({
  declarations: [
    PublicacionesComponent,
    PublicacionComponent,
    PublicacionServiceComponent
  ],
  imports: [
    CommonModule,
    NewsletterRoutingModule
  ]
})
export class NewsletterModule { }
