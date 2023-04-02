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



@NgModule({
  declarations: [
    CartComponent,
    CartItemComponent,
    ModalReceiptComponent,
    ProductItemComponent,
    ProductListComponent,
    PrincipalEcommerceComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    NgxPayPalModule
  ],
})
export class EcommerceModule { }
