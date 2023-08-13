import { CartItemModel } from "./cart-item-model";
import { Product } from "./product";

export class PedidoProducto {

    id!: string;
    producto: Product;
    cantidad: number = 0;

    constructor(producto: Product, cantidad: number){
        this.producto = producto;
        this.cantidad = cantidad;
     }

}
