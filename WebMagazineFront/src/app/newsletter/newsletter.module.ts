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
import { SuscripcionComponent } from './suscripcion/suscripcion.component';
import { SuscripcionFichaComponent } from './suscripcion/suscripcion-ficha/suscripcion-ficha.component';
import { VerificacionPagoComponent } from './suscripcion/verificacion-pago/verificacion-pago.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { RenovarSuscripcionComponent } from './suscripcion/renovar-suscripcion/renovar-suscripcion.component';
import { ChatComponent } from './chat/chat.component';
import { MensajeComponent } from './chat/mensaje/mensaje.component';
import { PublicacionesBorradorComponent } from './publicaciones/publicaciones-borrador/publicaciones-borrador.component';
import { EcommerceModule } from '../ecommerce/ecommerce.module';
import { PromoTiendaComponent } from './promo-tienda/promo-tienda.component';
import { PublicacionRestauranteComponent } from './publicaciones/publicacion-restaurante/publicacion-restaurante.component';




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
    PublicacionesBuscadorComponent,
    SuscripcionComponent,
    SuscripcionFichaComponent,
    VerificacionPagoComponent,
    RenovarSuscripcionComponent,
    ChatComponent,
    MensajeComponent,
    PublicacionesBorradorComponent,
    PromoTiendaComponent,
    PublicacionRestauranteComponent
  ],
  
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    FormsModule,
    QuillModule,
    AngularCropperjsModule,
    NgxPayPalModule
  ]
})
export class NewsletterModule { }
