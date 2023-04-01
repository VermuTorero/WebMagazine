import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './components/cart/cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { ModalReceiptComponent } from './components/modal-receipt/modal-receipt.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PrincipalEcommerceComponent } from './components/principal-ecommerce/principal-ecommerce.component';



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
  ],
})
export class EcommerceModule { }
