import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { MessageService } from '../../service/message.service';
import { StorageService } from '../../service/storage.service';
import { CartItemModel } from '../../models/cart-item-model';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItemModel[] = [];
  total = 0;


  constructor(
    private messageService: MessageService,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    if (this.storageService.existCart()) {
      this.cartItems = this.storageService.getCart();
    }
    this.getItem();
    this.total = this.getTotal();
  }

  getItem(): void {
    this.messageService.getMessage().subscribe((product: Product) => {
      let exists = false;
      this.cartItems.forEach((item) => {
        if (item.productId === product.id) {
          exists = true;
          item.qty++;
        }
      });
      if (!exists) {
        const cartItem = new CartItemModel(product);
        this.cartItems.push(cartItem);
      }
      this.total = this.getTotal();
      this.storageService.setCar(this.cartItems);
    });
  }

  getTotal(): number {
    let total = 0;
    this.cartItems.forEach((item) => {
      total += item.qty * item.productPrice;
    });
    return +total.toFixed(2);
  }

  emptyCart(): void {
    this.cartItems = [];
    this.total = 0;
    this.storageService.clear();
  }

  deleteItem(i: number): void {
    if (this.cartItems[i].qty > 1) {
      this.cartItems[i].qty--;
    } else {
      this.cartItems.splice(i, 1);
    }
    this.total = this.getTotal();
    this.storageService.setCar(this.cartItems);
  }

  getItemsList(): any[]{
    const items: any[] = [];
    let item = {};
    // productos del carrito lo metemos en un array con el formato de paypal
    //name, quantity, unit_amount
    this.cartItems.forEach((it: CartItemModel) => {
      item = {
        name: it.productName,
        quantity: it.qty,
        unit_amount: {value: it.productPrice, currency_code: 'EUR'}
      };
      items.push(item);
  });
  return items;
}

  

}
