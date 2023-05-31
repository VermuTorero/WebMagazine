import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ModalReceiptComponent } from './components/modal-receipt/modal-receipt.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';


//libreria externas
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { SeccionesComponent } from './components/secciones/secciones.component';
import { SeccionComponent } from './components/secciones/seccion/seccion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionComponent } from './components/gestion/gestion.component';
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormularioProductoComponent } from './components/gestion/formulario-producto/formulario-producto.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { PedidoComponent } from './components/pedido/pedido.component';
import { GestionPedidosComponent } from './components/gestion/gestion-pedidos/gestion-pedidos.component';
import localeEs from '@angular/common/locales/es';
import { PedidoDetalleComponent } from './components/gestion/gestion-pedidos/pedido-detalle/pedido-detalle.component'
import { CoreModule } from '../core/core.module';

//Para formatear fechas a hora local de España
registerLocaleData(localeEs, 'es');

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
    FormularioProductoComponent,
    PedidoComponent,
    GestionPedidosComponent,
    PedidoDetalleComponent
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
    AngularCropperjsModule, 
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    PrincipalEcommerceComponent
  ],
  providers:[{provide: LOCALE_ID, useValue: 'es'}] //para formatear fechas a hora local de españa
})
export class EcommerceModule { }
