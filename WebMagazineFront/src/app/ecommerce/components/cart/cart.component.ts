import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { MessageService } from '../../service/message.service';
import { StorageService } from '../../service/storage.service';
import { CartItemModel } from '../../models/cart-item-model';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReceiptComponent } from '../modal-receipt/modal-receipt.component';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItemModel[] = [];
  total = 0;
   //variable paypal
   public payPalConfig?: IPayPalConfig;


  constructor(
    private messageService: MessageService,
    private storageService: StorageService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
     //metodo paypal
     this.initConfig();
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

 // metodo paypal
 private initConfig(): void {
  this.payPalConfig = {
    currency: 'EUR',
    //colocar id de la pagina paypal developer, en proyecto meter variable en enviroment
    clientId:
      'AQ4kV3ijEVIItPbgLJtApqQdCEfaNV-xFShpVgdS8lmlI-J_L7U1-UPdiuXVbsivQfZyVQ43csdQJXCT',
    createOrderOnClient: (data) =>
      <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              //en que moneda lo queremos mirar doc de paypal
              currency_code: 'EUR',
              //colocamos el valor total de los items del carro en string
              value: this.getTotal().toString(),
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: this.getTotal().toString(),
                },
              },
            },
            // colocamos los items del carrito con el metodo getItemsList
            items: this.getItemsList(),
          },
        ],
      },
    advanced: {
      commit: 'true',
    },
    style: {
      label: 'paypal',
      layout: 'vertical',
    },
    onApprove: (data, actions) => {
      //mostramos un spinner mientras se procesa el pago
      this.spinner.show();
      console.log(
        'onApprove - transaction was approved, but not authorized',
        data,
        actions
      );
      actions.order.get().then((details: any) => {
        console.log(
          'onApprove - you can get full order details inside onApprove: ',
          details
        );
      });
    },
    onClientAuthorization: (data) => {
      console.log(
        'onClientAuthorization - you should probably inform your server about completed transaction at this point',
        data
      );
      //al autorizar la transaccion abrimos el modal y le pasamos los datos(data) al modal para que lo muestre
      this.openModal(
        data.purchase_units[0].items,
        data.purchase_units[0].amount.value
      )
      //vaciamos el carrito despues de la compra
      this.emptyCart();
      //cerramos el spinner al terminar el pago
      this.spinner.hide();
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: (err) => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
}

openModal(items: any, amount: any): void{
  const modalRef = this.modalService.open(ModalReceiptComponent, {size: 'lg'});
  modalRef.componentInstance.items = items;
  modalRef.componentInstance.amount = amount
}

}
