import { Usuario } from "src/app/newsletter/models/usuario";
import { Product } from "./product";
import { Direccion } from "./direccion";

export class Pedido {
    idPedido: string;
    fechaPedido: Date;
    fechaEnvio!: Date;
    fechaEntrega!: Date;
    direccionEntrega:  Direccion;
    usuario!: Usuario; //cambiar cuando la parte de usuario esté implementada y meter en el constructor
    productos: Product[];
    precioTotal: number;
    isCerrado: boolean;

    constructor(direccionEntrega: Direccion, precioTotal: number){
       this.idPedido = "";
       this.fechaPedido = new Date();
       this.direccionEntrega = direccionEntrega;
       this.precioTotal = precioTotal;
       this.productos = [];
       this.isCerrado = false;
    }
    
}
