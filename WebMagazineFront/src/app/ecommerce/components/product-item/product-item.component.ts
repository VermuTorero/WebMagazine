import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent {
  @Input()
  product!: Product;

  constructor(private messageService: MessageService) {}

  addToCart(): void {
    this.messageService.sendMessage(this.product);
  }
}
