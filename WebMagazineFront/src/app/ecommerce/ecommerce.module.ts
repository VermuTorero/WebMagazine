import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ModalReceiptComponent } from './components/modal-receipt/modal-receipt.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';
import { CoreModule } from '../core/core.module';

//libreria externas
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinner, NgxSpinnerModule } from 'ngx-spinner';
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { SeccionesComponent } from './components/secciones/secciones.component';
import { SeccionComponent } from './components/secciones/seccion/seccion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionComponent } from './components/gestion/gestion.component';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormularioProductoComponent } from './components/gestion/formulario-producto/formulario-producto.component';
import { AngularCropperjsModule } from 'angular-cropperjs';



@NgModule({
  declarations: [
    CartComponent,
    CartItemComponent,
    ModalReceiptComponent,
    ProductItemComponent,
    ProductListComponent,
    PrincipalEcommerceComponent,
    SeccionesComponent,
    SeccionComponent,
    GestionComponent,
    FormularioProductoComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    NgxPayPalModule,
    NgxSpinnerModule,
    EcommerceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    AngularCropperjsModule
  ],
  exports: [
    PrincipalEcommerceComponent
  ]
})
export class EcommerceModule { }
