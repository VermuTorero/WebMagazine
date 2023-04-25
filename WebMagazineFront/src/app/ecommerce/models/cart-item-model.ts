import { Product } from "./product";

export class CartItemModel {
    productId: number;
    productName: string;
    productPrice: number;
    qty: number;

    constructor(product: Product){
        this.productId = product.id;
        this.productName = product.nombreProducto;
        this.productPrice = product.precio;
        this.qty = 1;
    }
}
