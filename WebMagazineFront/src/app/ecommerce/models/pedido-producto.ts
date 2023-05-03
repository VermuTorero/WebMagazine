export class PedidoProducto {

    id!: string;
    producto: string = "";
    cantidad: number = 0;

    constructor(producto: string, cantidad: number){
        this.producto = producto;
        this.cantidad = cantidad;
     }

}
