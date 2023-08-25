import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { MessageService } from '../../service/message.service';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent {
  @Input() product!: Product;
  @Output() enviarEmailVendedorEvent = new EventEmitter<Product>();
  constructor(private messageService: MessageService, private productService: ProductService) {}

  addToCart(): void {
    this.messageService.sendMessage(this.product);
  }

  enviarEmailVendedor(){
    this.enviarEmailVendedorEvent.emit(this.product);
   
  }
}
